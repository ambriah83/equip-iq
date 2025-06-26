
import { supabase } from '@/integrations/supabase/client';

export interface CSVPreprocessingResult {
  needsPreprocessing: boolean;
  processedCSV?: string;
  error?: string;
  confidence: number;
}

export class CSVAIPreprocessor {
  /**
   * Analyzes a CSV to determine if it needs AI preprocessing
   */
  static analyzeCSVForPreprocessing(
    csvText: string, 
    requiredFields: string[], 
    fieldDescriptions: Record<string, string>
  ): { needsPreprocessing: boolean; issues: string[]; confidence: number } {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return { needsPreprocessing: false, issues: [], confidence: 0 };
    }

    const headerLine = lines[0];
    const headers = this.parseHeaderLine(headerLine);
    const issues: string[] = [];
    let confidence = 0;

    console.log('Analyzing CSV headers:', headers);
    console.log('Required fields:', requiredFields);

    // Check for missing required fields
    const missingFields = requiredFields.filter(field => {
      const found = headers.some(header => 
        this.fuzzyMatch(header, field) || 
        this.fuzzyMatch(header, Object.keys(fieldDescriptions).find(key => key === field) || '')
      );
      return !found;
    });

    if (missingFields.length > 0) {
      issues.push(`Missing required fields: ${missingFields.join(', ')}`);
      confidence += 30;
    }

    // Check for common problematic patterns
    const problematicPatterns = [
      { pattern: /^["'].*["']$/, issue: 'Headers wrapped in quotes', weight: 20 },
      { pattern: /\s+\w+\s+\w+/, issue: 'Multi-word headers with spaces', weight: 15 },
      { pattern: /[A-Z]{2,}\s[A-Z]{2,}/, issue: 'ALL CAPS headers', weight: 10 },
      { pattern: /\w+_\w+/, issue: 'Underscore separated headers', weight: 5 }
    ];

    problematicPatterns.forEach(({ pattern, issue, weight }) => {
      if (headers.some(header => pattern.test(header))) {
        issues.push(issue);
        confidence += weight;
      }
    });

    // Check for delimiter issues
    const commaCount = headerLine.split(',').length - 1;
    const semicolonCount = headerLine.split(';').length - 1;
    const tabCount = headerLine.split('\t').length - 1;
    
    if (semicolonCount > commaCount || tabCount > commaCount) {
      issues.push('Non-standard delimiter detected');
      confidence += 25;
    }

    // Check data consistency
    if (lines.length > 2) {
      const sampleDataLine = lines[1];
      const dataFields = this.parseHeaderLine(sampleDataLine);
      if (Math.abs(dataFields.length - headers.length) > 1) {
        issues.push('Inconsistent field count between header and data');
        confidence += 20;
      }
    }

    const needsPreprocessing = confidence > 30 || missingFields.length > 0;
    
    console.log('CSV Analysis Result:', {
      needsPreprocessing,
      issues,
      confidence,
      missingFields
    });

    return { needsPreprocessing, issues, confidence };
  }

  /**
   * Preprocesses CSV with AI to fix formatting and mapping issues
   */
  static async preprocessWithAI(
    csvText: string,
    dataType: string,
    requiredFields: string[],
    fieldDescriptions: Record<string, string>
  ): Promise<CSVPreprocessingResult> {
    console.log('Starting AI preprocessing for CSV...');
    
    try {
      const { data, error } = await supabase.functions.invoke('extract-data-from-image', {
        body: {
          imageData: null,
          csvData: csvText,
          dataType: dataType.toLowerCase(),
          requiredFields,
          fieldDescriptions,
          preprocessingMode: true // New flag to indicate this is preprocessing
        }
      });

      if (error) {
        console.error('AI preprocessing error:', error);
        return {
          needsPreprocessing: true,
          error: error.message || 'AI preprocessing failed',
          confidence: 0
        };
      }

      console.log('AI preprocessing result:', data);

      if (data.success && data.csvData) {
        return {
          needsPreprocessing: true,
          processedCSV: data.csvData,
          confidence: 95
        };
      } else {
        return {
          needsPreprocessing: true,
          error: data.message || 'AI could not process the CSV',
          confidence: 0
        };
      }
    } catch (error) {
      console.error('AI preprocessing error:', error);
      return {
        needsPreprocessing: true,
        error: error instanceof Error ? error.message : 'Unknown error during AI preprocessing',
        confidence: 0
      };
    }
  }

  /**
   * Parses a header line handling various CSV formats
   */
  private static parseHeaderLine(line: string): string[] {
    // Simple CSV parsing for header analysis
    return line.split(/[,;\t]/)
      .map(header => header.trim().replace(/^["']|["']$/g, ''))
      .filter(header => header.length > 0);
  }

  /**
   * Fuzzy matching for field names
   */
  private static fuzzyMatch(str1: string, str2: string): boolean {
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const norm1 = normalize(str1);
    const norm2 = normalize(str2);
    
    // Exact match
    if (norm1 === norm2) return true;
    
    // Contains match
    if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
    
    // Common variations
    const variations: Record<string, string[]> = {
      'name': ['title', 'label', 'description'],
      'location': ['store', 'branch', 'site', 'shop'],
      'phone': ['telephone', 'tel', 'contact'],
      'email': ['mail', 'contact'],
      'address': ['location', 'street'],
      'manager': ['supervisor', 'lead', 'boss']
    };
    
    for (const [key, vals] of Object.entries(variations)) {
      if ((norm1.includes(key) && vals.some(v => norm2.includes(v))) ||
          (norm2.includes(key) && vals.some(v => norm1.includes(v)))) {
        return true;
      }
    }
    
    return false;
  }
}
