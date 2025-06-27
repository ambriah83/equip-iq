
import { supabase } from '@/integrations/supabase/client';

export interface CSVPreprocessingResult {
  needsPreprocessing: boolean;
  processedCSV?: string;
  error?: string;
  confidence: number;
  analysisDetails?: {
    originalHeaders: string[];
    detectedIssues: string[];
    mappingSuggestions: Record<string, string>;
  };
}

export class CSVAIPreprocessor {
  /**
   * Enhanced CSV analysis with better column detection
   */
  static analyzeCSVForPreprocessing(
    csvText: string, 
    requiredFields: string[], 
    fieldDescriptions: Record<string, string>
  ): { needsPreprocessing: boolean; issues: string[]; confidence: number; analysisDetails: any } {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return { needsPreprocessing: false, issues: [], confidence: 0, analysisDetails: {} };
    }

    const headerLine = lines[0];
    const headers = this.parseHeaderLine(headerLine);
    const issues: string[] = [];
    const mappingSuggestions: Record<string, string> = {};
    let confidence = 0;

    console.log('🔍 CSV Analysis Details:');
    console.log('Original headers:', headers);
    console.log('Required fields:', requiredFields);

    // Enhanced column mapping detection
    const missingFields = requiredFields.filter(field => {
      // Try exact match first
      if (headers.some(header => header.toLowerCase() === field.toLowerCase())) {
        return false;
      }

      // Try fuzzy matching with enhanced patterns
      const matchedHeader = headers.find(header => {
        const matches = this.enhancedFuzzyMatch(header, field);
        if (matches) {
          mappingSuggestions[header] = field;
          console.log(`✅ Mapped "${header}" → "${field}"`);
          return true;
        }
        return false;
      });

      return !matchedHeader;
    });

    if (missingFields.length > 0) {
      issues.push(`Missing or unmatched fields: ${missingFields.join(', ')}`);
      confidence += 40;
      console.log('❌ Missing fields:', missingFields);
    }

    // Enhanced problematic pattern detection
    const problematicPatterns = [
      { pattern: /^["'].*["']$/, issue: 'Headers wrapped in quotes', weight: 20 },
      { pattern: /\s+\w+\s+\w+/, issue: 'Multi-word headers with spaces', weight: 15 },
      { pattern: /[A-Z]{2,}\s[A-Z]{2,}/, issue: 'ALL CAPS headers', weight: 10 },
      { pattern: /\w+_\w+/, issue: 'Underscore separated headers', weight: 5 },
      { pattern: /\w+\s+\w+\s+\w+/, issue: 'Three or more word headers', weight: 15 }
    ];

    problematicPatterns.forEach(({ pattern, issue, weight }) => {
      const matchingHeaders = headers.filter(header => pattern.test(header));
      if (matchingHeaders.length > 0) {
        issues.push(`${issue}: ${matchingHeaders.join(', ')}`);
        confidence += weight;
        console.log(`⚠️ Pattern issue: ${issue}`, matchingHeaders);
      }
    });

    // Enhanced delimiter detection
    const commaCount = headerLine.split(',').length - 1;
    const semicolonCount = headerLine.split(';').length - 1;
    const tabCount = headerLine.split('\t').length - 1;
    
    if (semicolonCount > commaCount || tabCount > commaCount) {
      issues.push('Non-standard delimiter detected');
      confidence += 25;
      console.log('⚠️ Non-standard delimiter detected');
    }

    // Data consistency check
    if (lines.length > 2) {
      const sampleDataLine = lines[1];
      const dataFields = this.parseHeaderLine(sampleDataLine);
      if (Math.abs(dataFields.length - headers.length) > 1) {
        issues.push('Inconsistent field count between header and data');
        confidence += 20;
        console.log('⚠️ Field count mismatch:', { headerCount: headers.length, dataCount: dataFields.length });
      }
    }

    const needsPreprocessing = confidence > 20 || missingFields.length > 0;
    
    const analysisDetails = {
      originalHeaders: headers,
      detectedIssues: issues,
      mappingSuggestions,
      confidence,
      delimiter: this.detectDelimiter(headerLine)
    };

    console.log('📊 Analysis Summary:', {
      needsPreprocessing,
      confidence,
      issuesCount: issues.length,
      mappingSuggestions
    });

    return { needsPreprocessing, issues, confidence, analysisDetails };
  }

  /**
   * Enhanced AI preprocessing with better prompting
   */
  static async preprocessWithAI(
    csvText: string,
    dataType: string,
    requiredFields: string[],
    fieldDescriptions: Record<string, string>
  ): Promise<CSVPreprocessingResult> {
    console.log('🤖 Starting enhanced AI preprocessing...');
    
    try {
      // Pre-analyze the CSV to provide better context to AI
      const analysis = this.analyzeCSVForPreprocessing(csvText, requiredFields, fieldDescriptions);
      
      const enhancedPrompt = {
        csvData: csvText,
        dataType: dataType.toLowerCase(),
        requiredFields,
        fieldDescriptions,
        preprocessingMode: true,
        analysisContext: {
          detectedIssues: analysis.issues,
          mappingSuggestions: analysis.analysisDetails.mappingSuggestions,
          originalHeaders: analysis.analysisDetails.originalHeaders,
          instructions: [
            'Focus on standardizing column names to match required fields exactly',
            'Handle common variations like "Location Name" → "name", "STORE MANAGER" → "manager_name"',
            'Preserve all data while fixing column mapping issues',
            'Ensure consistent delimiter usage (prefer commas)',
            'Remove unnecessary quotes around headers and data'
          ]
        }
      };

      console.log('📤 Sending to AI with enhanced context:', enhancedPrompt.analysisContext);

      const { data, error } = await supabase.functions.invoke('extract-data-from-image', {
        body: enhancedPrompt
      });

      if (error) {
        console.error('❌ AI preprocessing error:', error);
        return {
          needsPreprocessing: true,
          error: error.message || 'AI preprocessing failed',
          confidence: 0,
          analysisDetails: analysis.analysisDetails
        };
      }

      console.log('✅ AI preprocessing result:', data);

      if (data.success && data.csvData) {
        // Validate the processed CSV
        const processedAnalysis = this.analyzeCSVForPreprocessing(data.csvData, requiredFields, fieldDescriptions);
        console.log('📋 Processed CSV analysis:', processedAnalysis);

        return {
          needsPreprocessing: true,
          processedCSV: data.csvData,
          confidence: Math.min(95, 80 + (5 - processedAnalysis.issues.length) * 3),
          analysisDetails: {
            ...analysis.analysisDetails,
            processedHeaders: processedAnalysis.analysisDetails.originalHeaders,
            improvementsMade: analysis.issues.length - processedAnalysis.issues.length
          }
        };
      } else {
        return {
          needsPreprocessing: true,
          error: data.message || 'AI could not process the CSV',
          confidence: 0,
          analysisDetails: analysis.analysisDetails
        };
      }
    } catch (error) {
      console.error('❌ AI preprocessing error:', error);
      return {
        needsPreprocessing: true,
        error: error instanceof Error ? error.message : 'Unknown error during AI preprocessing',
        confidence: 0
      };
    }
  }

  /**
   * Enhanced fuzzy matching with location-specific patterns
   */
  private static enhancedFuzzyMatch(header: string, requiredField: string): boolean {
    const normalizeHeader = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normHeader = normalizeHeader(header);
    const normRequired = normalizeHeader(requiredField);
    
    // Exact match after normalization
    if (normHeader === normRequired) return true;
    
    // Contains match
    if (normHeader.includes(normRequired) || normRequired.includes(normHeader)) return true;
    
    // Enhanced location-specific mappings
    const fieldMappings: Record<string, string[]> = {
      'name': [
        'locationname', 'storename', 'businessname', 'companyname', 'shopname',
        'branchname', 'sitename', 'title', 'label', 'description'
      ],
      'locationname': [
        'name', 'storename', 'businessname', 'location', 'store', 'branch', 'site'
      ],
      'abbreviation': [
        'locationcode', 'storecode', 'code', 'abbrev', 'shortname', 'id'
      ],
      'address': [
        'streetaddress', 'fulladdress', 'physicaladdress', 'locationaddress', 'location'
      ],
      'managername': [
        'storemanager', 'branchmanager', 'areamanager', 'manager', 'supervisor', 'lead'
      ],
      'manager_name': [
        'storemanager', 'branchmanager', 'areamanager', 'manager', 'supervisor', 'lead'
      ],
      'phone': [
        'directstoreline', 'phonenumber', 'telephone', 'tel', 'contact'
      ],
      'email': [
        'emailaddress', 'contactemail', 'mail'
      ]
    };
    
    // Check field mappings
    const mappings = fieldMappings[normRequired] || [];
    if (mappings.some(mapping => normHeader.includes(mapping) || mapping.includes(normHeader))) {
      return true;
    }
    
    // Reverse check - see if required field matches any mapped values
    for (const [field, variations] of Object.entries(fieldMappings)) {
      if (variations.includes(normRequired) && normHeader.includes(field)) {
        return true;
      }
    }
    
    // Word-based matching for multi-word fields
    const headerWords = header.toLowerCase().split(/[\s_-]+/);
    const requiredWords = requiredField.toLowerCase().split(/[\s_-]+/);
    
    const commonWords = headerWords.filter(word => 
      requiredWords.some(rWord => word.includes(rWord) || rWord.includes(word))
    );
    
    return commonWords.length >= Math.min(headerWords.length, requiredWords.length) * 0.6;
  }

  /**
   * Enhanced header parsing with better delimiter detection
   */
  private static parseHeaderLine(line: string): string[] {
    const delimiter = this.detectDelimiter(line);
    return line.split(delimiter)
      .map(header => header.trim().replace(/^["']|["']$/g, ''))
      .filter(header => header.length > 0);
  }

  /**
   * Detect the most likely delimiter in a CSV line
   */
  private static detectDelimiter(line: string): string {
    const delimiters = [',', ';', '\t', '|'];
    const counts = delimiters.map(delim => ({
      delimiter: delim,
      count: line.split(delim).length - 1
    }));
    
    const bestDelimiter = counts.reduce((best, current) => 
      current.count > best.count ? current : best
    );
    
    return bestDelimiter.count > 0 ? bestDelimiter.delimiter : ',';
  }
}
