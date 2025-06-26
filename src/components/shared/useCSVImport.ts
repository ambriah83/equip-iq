
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CSVParser, CSVParseResult } from '@/utils/csvParser';
import { CSVAIPreprocessor } from '@/utils/csvAIPreprocessor';

interface ImportResult {
  success: boolean;
  processed: number;
  errors: string[];
}

interface UseCSVImportProps {
  title: string;
  onImport: (data: any[]) => Promise<ImportResult>;
  requiredFields: string[];
  fieldDescriptions: Record<string, string>;
}

export const useCSVImport = ({ title, onImport, requiredFields, fieldDescriptions }: UseCSVImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [extractingFromImage, setExtractingFromImage] = useState(false);
  const [processingWithAI, setProcessingWithAI] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [extractedData, setExtractedData] = useState<string | null>(null);
  const [aiProcessedData, setAiProcessedData] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [autoProcessingStatus, setAutoProcessingStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSVWithAdvancedParser = (text: string): any[] => {
    console.log('Using advanced CSV parser...');
    
    const validation = CSVParser.validateCSV(text);
    if (!validation.isValid) {
      console.log('CSV validation failed:', validation.errors);
    }

    const parseResult = CSVParser.parse(text, {
      autoDetectDelimiter: true,
      skipEmptyLines: true
    });

    console.log('Advanced parser results:', {
      delimiter: parseResult.delimiter,
      headers: parseResult.headers,
      rowCount: parseResult.rowCount,
      sampleData: parseResult.data[0]
    });

    setParseResult(parseResult);
    return parseResult.data;
  };

  const processCSVAutomatically = async (csvText: string): Promise<string> => {
    console.log('Starting automatic CSV preprocessing...');
    setAutoProcessingStatus('Analyzing CSV format...');
    
    // Step 1: Analyze if preprocessing is needed
    const analysis = CSVAIPreprocessor.analyzeCSVForPreprocessing(
      csvText, 
      requiredFields, 
      fieldDescriptions
    );

    console.log('CSV Analysis:', analysis);

    if (!analysis.needsPreprocessing) {
      console.log('CSV appears to be well-formatted, skipping AI preprocessing');
      setAutoProcessingStatus(null);
      return csvText;
    }

    // Step 2: Automatically preprocess with AI
    setAutoProcessingStatus(`Detected formatting issues (${analysis.issues.join(', ')}). Auto-fixing with AI...`);
    setProcessingWithAI(true);

    try {
      const preprocessResult = await CSVAIPreprocessor.preprocessWithAI(
        csvText,
        title,
        requiredFields,
        fieldDescriptions
      );

      if (preprocessResult.processedCSV) {
        console.log('AI preprocessing successful');
        setAutoProcessingStatus('✅ Auto-fixed CSV formatting with AI');
        toast({
          title: "CSV Auto-Fixed",
          description: `Automatically corrected ${analysis.issues.length} formatting issues using AI.`,
        });
        return preprocessResult.processedCSV;
      } else {
        console.log('AI preprocessing failed, using original CSV');
        setAutoProcessingStatus('⚠️ AI preprocessing failed, using original format');
        toast({
          title: "Auto-Fix Partially Failed",
          description: "Some formatting issues detected but couldn't be auto-fixed. You may need to manually adjust the CSV.",
          variant: "destructive"
        });
        return csvText;
      }
    } catch (error) {
      console.error('Auto-preprocessing error:', error);
      setAutoProcessingStatus('❌ Auto-fix failed, using original format');
      return csvText;
    } finally {
      setProcessingWithAI(false);
      // Clear status after 3 seconds
      setTimeout(() => setAutoProcessingStatus(null), 3000);
    }
  };

  const parseExcel = async (file: File): Promise<any[]> => {
    console.log('Parsing Excel file...');
    throw new Error('Excel file parsing is not yet implemented. Please convert your Excel file to CSV format and try again.');
  };

  const processCSVWithAI = async (csvText: string) => {
    console.log('Manual CSV processing with AI...');
    setProcessingWithAI(true);

    try {
      const result = await CSVAIPreprocessor.preprocessWithAI(
        csvText,
        title,
        requiredFields,
        fieldDescriptions
      );

      if (result.processedCSV) {
        setAiProcessedData(result.processedCSV);
        toast({
          title: "AI Processing Complete",
          description: "Successfully processed and mapped your CSV data. Review and import if correct.",
        });
      } else {
        toast({
          title: "AI Processing Failed",
          description: result.error || "Could not process the CSV data with AI.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Manual AI processing error:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An error occurred while processing the CSV with AI.",
        variant: "destructive"
      });
    } finally {
      setProcessingWithAI(false);
    }
  };

  const extractDataFromImage = async () => {
    if (!imageFile) return;

    console.log('Starting image data extraction...');
    setExtractingFromImage(true);

    try {
      const reader = new FileReader();
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      console.log('Image converted to base64, calling extraction function...');

      const { data, error } = await supabase.functions.invoke('extract-data-from-image', {
        body: {
          imageData: imageDataUrl,
          dataType: title.toLowerCase(),
          requiredFields,
          fieldDescriptions
        }
      });

      if (error) {
        throw error;
      }

      console.log('Extraction result:', data);

      if (data.success && data.csvData) {
        setExtractedData(data.csvData);
        toast({
          title: "Data Extracted",
          description: "Successfully extracted data from image. Review and import if correct.",
        });
      } else {
        toast({
          title: "Extraction Failed",
          description: data.message || "Could not extract structured data from the image.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Image extraction error:', error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "An error occurred while extracting data from the image.",
        variant: "destructive"
      });
    } finally {
      setExtractingFromImage(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Starting import process with AI-first preprocessing...');
    setImporting(true);
    
    try {
      let data: any[] = [];
      let csvText = '';
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        data = await parseExcel(file);
      } else {
        csvText = await file.text();
        console.log('File content read successfully, length:', csvText.length);
        
        // AI-First Processing: Automatically preprocess if needed
        const processedCSV = await processCSVAutomatically(csvText);
        data = parseCSVWithAdvancedParser(processedCSV);
      }
      
      if (data.length === 0) {
        console.log('No data found in file after parsing');
        toast({
          title: "No Data Found",
          description: "The file appears to be empty or could not be parsed.",
          variant: "destructive"
        });
        return;
      }

      console.log('Calling onImport with parsed data:', data.length, 'rows');
      console.log('Sample row structure:', Object.keys(data[0] || {}));
      
      const result = await onImport(data);
      console.log('Import result:', result);
      
      setResult(result);

      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.processed} records.`,
        });
      } else if (result.processed > 0) {
        toast({
          title: "Partial Import Success",
          description: `Imported ${result.processed} records successfully, ${result.errors.length} had errors.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Import Failed",
          description: `No records were imported. ${result.errors.length} errors found.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "An error occurred while importing the file.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleImportFromProcessed = async (dataSource: string) => {
    const dataToImport = dataSource === 'extracted' ? extractedData : aiProcessedData;
    if (!dataToImport) return;

    console.log('Importing processed data from:', dataSource);
    setImporting(true);

    try {
      const data = parseCSVWithAdvancedParser(dataToImport);
      
      if (data.length === 0) {
        console.log('No data found in processed text');
        toast({
          title: "No Data",
          description: "The processed data appears to be empty or invalid.",
          variant: "destructive"
        });
        return;
      }

      console.log('Calling onImport with processed data:', data.length, 'rows');
      const result = await onImport(data);
      console.log('Import result:', result);
      
      setResult(result);

      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.processed} records.`,
        });
      } else {
        toast({
          title: "Import Completed with Errors",
          description: `Processed ${result.processed} records with ${result.errors.length} errors.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "An error occurred while importing the data.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setImageFile(null);
    setExtractedData(null);
    setAiProcessedData(null);
    setResult(null);
    setParseResult(null);
    setAutoProcessingStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  return {
    file,
    setFile,
    imageFile,
    setImageFile,
    importing,
    extractingFromImage,
    processingWithAI,
    result,
    extractedData,
    setExtractedData,
    aiProcessedData,
    setAiProcessedData,
    parseResult,
    autoProcessingStatus,
    fileInputRef,
    imageInputRef,
    handleImport,
    handleImportFromProcessed,
    extractDataFromImage,
    processCSVWithAI,
    reset
  };
};
