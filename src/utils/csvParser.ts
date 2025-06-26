
export interface CSVParseOptions {
  delimiter?: string;
  quote?: string;
  escape?: string;
  skipEmptyLines?: boolean;
  autoDetectDelimiter?: boolean;
}

export interface CSVParseResult {
  data: any[];
  headers: string[];
  delimiter: string;
  rowCount: number;
}

export class CSVParser {
  private static detectDelimiter(text: string): string {
    const sample = text.split('\n').slice(0, 5).join('\n');
    const delimiters = [',', ';', '\t', '|'];
    const counts = delimiters.map(delimiter => ({
      delimiter,
      count: (sample.match(new RegExp(`\\${delimiter}`, 'g')) || []).length
    }));
    
    const bestMatch = counts.reduce((a, b) => a.count > b.count ? a : b);
    return bestMatch.count > 0 ? bestMatch.delimiter : ',';
  }

  private static parseCSVLine(line: string, delimiter: string, quote: string = '"'): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === quote) {
        if (inQuotes && nextChar === quote) {
          // Escaped quote inside quoted field
          current += quote;
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === delimiter && !inQuotes) {
        // Field separator outside quotes
        result.push(current.trim());
        current = '';
        i++;
      } else {
        // Regular character
        current += char;
        i++;
      }
    }

    // Add the last field
    result.push(current.trim());
    return result;
  }

  static parse(text: string, options: CSVParseOptions = {}): CSVParseResult {
    const {
      delimiter: providedDelimiter,
      quote = '"',
      escape = '"',
      skipEmptyLines = true,
      autoDetectDelimiter = true
    } = options;

    console.log('CSV Parser: Starting parse with options:', options);
    
    // Clean the text
    const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    
    if (!cleanText) {
      console.log('CSV Parser: Empty text provided');
      return { data: [], headers: [], delimiter: ',', rowCount: 0 };
    }

    // Detect or use provided delimiter
    const delimiter = providedDelimiter || (autoDetectDelimiter ? this.detectDelimiter(cleanText) : ',');
    console.log('CSV Parser: Using delimiter:', JSON.stringify(delimiter));

    // Split into lines
    const lines = cleanText.split('\n');
    console.log('CSV Parser: Found', lines.length, 'lines');

    if (lines.length === 0) {
      return { data: [], headers: [], delimiter, rowCount: 0 };
    }

    // Parse header row
    const headerLine = lines[0];
    const headers = this.parseCSVLine(headerLine, delimiter, quote)
      .map(header => header.replace(/^["']|["']$/g, '').trim())
      .filter(header => header.length > 0);
    
    console.log('CSV Parser: Parsed headers:', headers);

    if (headers.length === 0) {
      console.log('CSV Parser: No valid headers found');
      return { data: [], headers: [], delimiter, rowCount: 0 };
    }

    // Parse data rows
    const data: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (skipEmptyLines && !line) {
        console.log(`CSV Parser: Skipping empty line ${i + 1}`);
        continue;
      }

      try {
        const values = this.parseCSVLine(line, delimiter, quote)
          .map(value => value.replace(/^["']|["']$/g, '').trim());
        
        // Create row object
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        data.push(row);
        console.log(`CSV Parser: Parsed row ${i + 1}:`, Object.keys(row));
      } catch (error) {
        console.error(`CSV Parser: Error parsing line ${i + 1}:`, error);
        console.log(`CSV Parser: Problematic line: "${line}"`);
      }
    }

    console.log('CSV Parser: Successfully parsed', data.length, 'data rows');
    console.log('CSV Parser: Sample row data:', data[0] ? Object.keys(data[0]) : 'No data');

    return {
      data,
      headers,
      delimiter,
      rowCount: data.length
    };
  }

  static validateCSV(text: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!text || !text.trim()) {
      errors.push('CSV text is empty');
      return { isValid: false, errors };
    }

    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      errors.push('CSV must have at least a header row and one data row');
      return { isValid: false, errors };
    }

    // Try to parse and see if it works
    try {
      const result = this.parse(text);
      if (result.headers.length === 0) {
        errors.push('No valid headers found in CSV');
      }
      if (result.data.length === 0) {
        errors.push('No valid data rows found in CSV');
      }
    } catch (error) {
      errors.push(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { isValid: errors.length === 0, errors };
  }
}
