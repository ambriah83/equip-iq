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
   * Enhanced CSV analysis with specific focus on Glo Tanning format
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

    console.log('🔍 Enhanced CSV Analysis for Glo Tanning Format:');
    console.log('Original headers:', headers);
    console.log('Required fields:', requiredFields);

    // Specific mappings for Glo Tanning CSV format
    const specificMappings: Record<string, string[]> = {
      'Location Name': [
        'location name', 'locationname', 'name', 'location', 'store name', 'storename',
        'business name', 'shop name', 'branch name', 'site name'
      ],
      'Tan-Link or SunLync': [
        'tanlink or sunlync', 'tan-link', 'tanlink', 'sunlync', 'abbreviation',
        'location code', 'store code', 'code', 'abbrev', 'short name', 'id'
      ],
      'address': [
        'street address', 'full address', 'physical address', 'location address', 'addr'
      ],
      'STORE MANAGER': [
        'store manager', 'manager name', 'manager', 'branch manager', 'area manager',
        'supervisor', 'lead', 'manager_name'
      ],
      'Direct Store Line': [
        'direct store line', 'phone number', 'phone', 'telephone', 'tel', 'contact'
      ],
      'Corporate or Franchise': [
        'corporate or franchise', 'ownership type', 'type', 'ownership', 'category'
      ]
    };

    // Enhanced column mapping detection with specific focus
    const missingFields = requiredFields.filter(field => {
      // Try exact match first
      if (headers.some(header => header.toLowerCase() === field.toLowerCase())) {
        return false;
      }

      // Try specific mappings for Glo Tanning format
      const normalizedField = field.toLowerCase();
      const possibleVariations = specificMappings[field] || specificMappings[normalizedField] || [];
      
      const matchedHeader = headers.find(header => {
        const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Check against specific variations
        for (const variation of possibleVariations) {
          const normalizedVariation = variation.replace(/[^a-z0-9]/g, '');
          if (normalizedHeader === normalizedVariation || 
              normalizedHeader.includes(normalizedVariation) ||
              normalizedVariation.includes(normalizedHeader)) {
            mappingSuggestions[header] = field;
            console.log(`✅ Specific mapping found: "${header}" → "${field}"`);
            return true;
          }
        }
        
        // Enhanced fuzzy matching
        return this.enhancedFuzzyMatch(header, field);
      });

      if (matchedHeader) {
        mappingSuggestions[matchedHeader] = field;
        return false;
      }

      return true;
    });

    if (missingFields.length > 0) {
      issues.push(`Missing or unmatched critical fields: ${missingFields.join(', ')}`);
      confidence += 50; // Higher confidence for missing critical fields
      console.log('❌ Missing critical fields:', missingFields);
    }

    // Enhanced problematic pattern detection for Glo Tanning format
    const problematicPatterns = [
      { pattern: /^["'].*["']$/, issue: 'Headers wrapped in quotes', weight: 25 },
      { pattern: /\s+or\s+/i, issue: 'Headers with "or" separator (like "Tan-Link or SunLync")', weight: 30 },
      { pattern: /[A-Z]{2,}\s[A-Z]{2,}/, issue: 'ALL CAPS multi-word headers', weight: 20 },
      { pattern: /\w+\s+\w+\s+\w+/, issue: 'Three or more word headers', weight: 15 },
      { pattern: /-/, issue: 'Headers with hyphens', weight: 10 }
    ];

    problematicPatterns.forEach(({ pattern, issue, weight }) => {
      const matchingHeaders = headers.filter(header => pattern.test(header));
      if (matchingHeaders.length > 0) {
        issues.push(`${issue}: ${matchingHeaders.join(', ')}`);
        confidence += weight;
        console.log(`⚠️ Pattern issue detected: ${issue}`, matchingHeaders);
      }
    });

    // Check for Glo Tanning specific indicators
    const gloTanningIndicators = [
      'tan-link', 'sunlync', 'store manager', 'direct store line', 'corporate or franchise'
    ];
    
    const foundIndicators = headers.filter(header => 
      gloTanningIndicators.some(indicator => 
        header.toLowerCase().includes(indicator.toLowerCase())
      )
    );

    if (foundIndicators.length > 0) {
      issues.push(`Glo Tanning specific format detected: ${foundIndicators.join(', ')}`);
      confidence += 40;
      console.log('🏢 Glo Tanning format indicators found:', foundIndicators);
    }

    // Enhanced delimiter detection
    const commaCount = headerLine.split(',').length - 1;
    const semicolonCount = headerLine.split(';').length - 1;
    const tabCount = headerLine.split('\t').length - 1;
    
    if (semicolonCount > commaCount || tabCount > commaCount) {
      issues.push('Non-standard delimiter detected');
      confidence += 25;
      console.log('⚠️ Non-standard delimiter detected');
    }

    // Data consistency check with enhanced validation
    if (lines.length > 2) {
      const sampleDataLine = lines[1];
      const dataFields = this.parseHeaderLine(sampleDataLine);
      if (Math.abs(dataFields.length - headers.length) > 1) {
        issues.push('Inconsistent field count between header and data');
        confidence += 30;
        console.log('⚠️ Field count mismatch:', { headerCount: headers.length, dataCount: dataFields.length });
      }
    }

    const needsPreprocessing = confidence > 15 || missingFields.length > 0;
    
    const analysisDetails = {
      originalHeaders: headers,
      detectedIssues: issues,
      mappingSuggestions,
      confidence,
      delimiter: this.detectDelimiter(headerLine),
      gloTanningFormat: foundIndicators.length > 0
    };

    console.log('📊 Enhanced Analysis Summary:', {
      needsPreprocessing,
      confidence,
      issuesCount: issues.length,
      mappingSuggestions,
      isGloTanningFormat: foundIndicators.length > 0
    });

    return { needsPreprocessing, issues, confidence, analysisDetails };
  }

  /**
   * Enhanced AI preprocessing with Glo Tanning specific prompting
   */
  static async preprocessWithAI(
    csvText: string,
    dataType: string,
    requiredFields: string[],
    fieldDescriptions: Record<string, string>
  ): Promise<CSVPreprocessingResult> {
    console.log('🤖 Starting Glo Tanning specific AI preprocessing...');
    
    try {
      // Pre-analyze the CSV to provide better context to AI
      const analysis = this.analyzeCSVForPreprocessing(csvText, requiredFields, fieldDescriptions);
      
      const enhancedPrompt = {
        csvData: csvText,
        dataType: dataType.toLowerCase(),
        requiredFields,
        fieldDescriptions,
        preprocessingMode: true,
        gloTanningSpecific: true,
        analysisContext: {
          detectedIssues: analysis.issues,
          mappingSuggestions: analysis.analysisDetails.mappingSuggestions,
          originalHeaders: analysis.analysisDetails.originalHeaders,
          isGloTanningFormat: analysis.analysisDetails.gloTanningFormat,
          specificInstructions: [
            'This is a Glo Tanning franchise location import CSV',
            'Map "Tan-Link or SunLync" to a simple abbreviation field',
            'Map "STORE MANAGER" to manager_name field',
            'Map "Direct Store Line" to phone field',
            'Map "Corporate or Franchise" to ownership_type field',
            'Standardize all column names to match required fields exactly',
            'Handle multi-word headers with spaces and special characters',
            'Remove unnecessary quotes and normalize formatting',
            'Ensure consistent comma delimiter usage'
          ]
        }
      };

      console.log('📤 Sending to AI with Glo Tanning specific context:', enhancedPrompt.analysisContext);

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
          confidence: Math.min(95, 85 + (5 - processedAnalysis.issues.length) * 2),
          analysisDetails: {
            ...analysis.analysisDetails,
            processedHeaders: processedAnalysis.analysisDetails.originalHeaders,
            improvementsMade: analysis.issues.length - processedAnalysis.issues.length
          }
        };
      } else {
        return {
          needsPreprocessing: true,
          error: data.message || 'AI could not process the Glo Tanning CSV format',
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
   * Enhanced fuzzy matching with Glo Tanning specific patterns
   */
  private static enhancedFuzzyMatch(header: string, requiredField: string): boolean {
    const normalizeHeader = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normHeader = normalizeHeader(header);
    const normRequired = normalizeHeader(requiredField);
    
    // Exact match after normalization
    if (normHeader === normRequired) return true;
    
    // Contains match
    if (normHeader.includes(normRequired) || normRequired.includes(normHeader)) return true;
    
    // Glo Tanning specific fuzzy matching
    const gloTanningMappings: Record<string, string[]> = {
      'locationname': [
        'name', 'location', 'store', 'business', 'shop', 'branch', 'site'
      ],
      'tanlinkorsunlync': [
        'abbreviation', 'code', 'abbrev', 'shortname', 'id', 'tanlink', 'sunlync'
      ],
      'address': [
        'streetaddress', 'fulladdress', 'physicaladdress', 'locationaddress'
      ],
      'storemanager': [
        'managername', 'manager', 'branchmanager', 'areamanager', 'supervisor'
      ],
      'directstoreline': [
        'phone', 'phonenumber', 'telephone', 'tel', 'contact'
      ],
      'corporateorfranchise': [
        'ownershiptype', 'type', 'ownership', 'category'
      ]
    };
    
    // Check Glo Tanning specific mappings
    const mappings = gloTanningMappings[normRequired] || [];
    if (mappings.some(mapping => normHeader.includes(mapping) || mapping.includes(normHeader))) {
      return true;
    }
    
    // Reverse check
    for (const [field, variations] of Object.entries(gloTanningMappings)) {
      if (variations.includes(normRequired) && normHeader.includes(field)) {
        return true;
      }
    }
    
    // Word-based matching with enhanced weight for Glo Tanning terms
    const headerWords = header.toLowerCase().split(/[\s_-]+/);
    const requiredWords = requiredField.toLowerCase().split(/[\s_-]+/);
    
    const commonWords = headerWords.filter(word => 
      requiredWords.some(rWord => {
        // Exact word match
        if (word === rWord) return true;
        // Partial match for longer words
        if (word.length > 3 && rWord.length > 3) {
          return word.includes(rWord) || rWord.includes(word);
        }
        return false;
      })
    );
    
    // Higher threshold for better matching
    return commonWords.length >= Math.min(headerWords.length, requiredWords.length) * 0.7;
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
