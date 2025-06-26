
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): any[] => {
    console.log('Parsing CSV text, length:', text.length);
    const lines = text.split('\n').filter(line => line.trim());
    console.log('Found lines:', lines.length);
    
    if (lines.length < 2) {
      console.log('Not enough lines in CSV');
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    console.log('Headers found:', headers);
    
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }

    console.log('Parsed data:', data);
    return data;
  };

  const parseExcel = async (file: File): Promise<any[]> => {
    console.log('Parsing Excel file...');
    throw new Error('Excel file parsing is not yet implemented. Please convert your Excel file to CSV format and try again.');
  };

  const processCSVWithAI = async (csvText: string) => {
    console.log('Processing CSV with AI...');
    setProcessingWithAI(true);

    try {
      const { data, error } = await supabase.functions.invoke('extract-data-from-image', {
        body: {
          imageData: null,
          csvData: csvText,
          dataType: title.toLowerCase(),
          requiredFields,
          fieldDescriptions
        }
      });

      if (error) {
        throw error;
      }

      console.log('AI processing result:', data);

      if (data.success && data.csvData) {
        setAiProcessedData(data.csvData);
        toast({
          title: "AI Processing Complete",
          description: "Successfully processed and mapped your CSV data. Review and import if correct.",
        });
      } else {
        toast({
          title: "AI Processing Failed",
          description: data.message || "Could not process the CSV data with AI.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('AI processing error:', error);
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

    console.log('Starting import process...');
    setImporting(true);
    
    try {
      let data: any[] = [];
      let csvText = '';
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        data = await parseExcel(file);
      } else {
        csvText = await file.text();
        console.log('File content read successfully');
        data = parseCSV(csvText);
      }
      
      if (data.length === 0) {
        console.log('No data found in file');
        toast({
          title: "No Data",
          description: "The file appears to be empty or invalid.",
          variant: "destructive"
        });
        return;
      }

      console.log('Calling onImport with data:', data.length, 'rows');
      const result = await onImport(data);
      console.log('Import result:', result);
      
      setResult(result);

      if (!result.success && result.errors.length > 0 && csvText) {
        const hasFieldErrors = result.errors.some(error => 
          error.includes('is required') || 
          error.includes('Invalid') ||
          error.includes('field')
        );
        
        if (hasFieldErrors) {
          toast({
            title: "Format Issues Detected",
            description: "Would you like to use AI to automatically fix the column mapping?",
          });
        }
      }

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

    console.log('Importing processed data...');
    setImporting(true);

    try {
      const data = parseCSV(dataToImport);
      
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
    fileInputRef,
    imageInputRef,
    handleImport,
    handleImportFromProcessed,
    extractDataFromImage,
    processCSVWithAI,
    reset
  };
};
