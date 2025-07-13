
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CSVParser } from '@/utils/csvParser';
import { CSVAIPreprocessor } from '@/utils/csvAIPreprocessor';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

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
  const [parseResult, setParseResult] = useState<any>(null);
  const [autoProcessingStatus, setAutoProcessingStatus] = useState<string | null>(null);
  const [processingDetails, setProcessingDetails] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const reset = () => {
    setFile(null);
    setImageFile(null);
    setImporting(false);
    setExtractingFromImage(false);
    setProcessingWithAI(false);
    setResult(null);
    setExtractedData(null);
    setAiProcessedData(null);
    setParseResult(null);
    setAutoProcessingStatus(null);
    setProcessingDetails(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!file) return;

    console.log('🚀 Starting enhanced import process for:', file.name);
    console.log('📊 File type:', file.type);
    console.log('📊 File name ends with .xlsx?', file.name.endsWith('.xlsx'));
    console.log('📊 File name ends with .xls?', file.name.endsWith('.xls'));
    
    setImporting(true);
    setResult(null);
    setAutoProcessingStatus('🔍 Analyzing file structure...');

    try {
      let text = '';
      
      // Check if it's an Excel file by name or MIME type
      const isExcel = file.name.toLowerCase().endsWith('.xlsx') || 
                     file.name.toLowerCase().endsWith('.xls') ||
                     file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                     file.type === 'application/vnd.ms-excel';
      
      if (isExcel) {
        console.log('📊 Detected Excel file:', file.name);
        setAutoProcessingStatus('📊 Converting Excel file to CSV format...');
        
        try {
          const arrayBuffer = await file.arrayBuffer();
          console.log('📊 Excel file loaded, size:', arrayBuffer.byteLength);
          
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          console.log('📊 Workbook parsed, sheets:', workbook.SheetNames);
          
          // Get the first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          console.log('📊 Using sheet:', firstSheetName);
          
          // Convert to CSV
          text = XLSX.utils.sheet_to_csv(worksheet);
          console.log('✅ Excel converted to CSV, size:', text.length);
          console.log('📊 First 200 chars of CSV:', text.substring(0, 200));
        } catch (xlsxError) {
          console.error('❌ Excel conversion error:', xlsxError);
          throw new Error(`Failed to convert Excel file: ${xlsxError.message}`);
        }
      } else {
        // Regular CSV file
        text = await file.text();
        console.log('📄 File content loaded, size:', text.length);
      }

      // Only analyze as CSV if it's actually text
      if (text.includes('\0') || text.charCodeAt(0) === 0xFFFE || text.charCodeAt(0) === 0xFEFF || text.startsWith('PK')) {
        // This is binary data that wasn't converted properly
        console.error('❌ Binary data detected after conversion attempt');
        throw new Error('Failed to convert Excel file to CSV format. Please try uploading a CSV file instead.');
      }
      
      // Enhanced CSV analysis
      const analysis = CSVAIPreprocessor.analyzeCSVForPreprocessing(text, requiredFields, fieldDescriptions);
      setProcessingDetails(analysis.analysisDetails);
      
      console.log('📊 CSV Analysis completed:', analysis);

      // Check if this is a well-formatted Excel conversion that doesn't need AI
      const hasRequiredHeaders = requiredFields.every(field => {
        const headers = analysis.analysisDetails?.originalHeaders || [];
        console.log(`Checking for required field "${field}" in headers:`, headers);
        
        // More flexible matching for Excel headers
        const fieldWords = field.toLowerCase().replace(/_/g, ' ').split(' ');
        return headers.some(header => {
          const headerLower = header.toLowerCase();
          // Check if all words from the field exist in the header (in any order)
          return fieldWords.every(word => headerLower.includes(word));
        });
      });
      
      console.log('Has all required headers?', hasRequiredHeaders);

      if (hasRequiredHeaders && analysis.confidence >= 40) {
        console.log('✅ Excel file has all required fields, skipping AI processing');
        setAutoProcessingStatus('✅ Excel file is well-formatted! Parsing data...');
        
        const parseResult = CSVParser.parse(text);
        setParseResult(parseResult);
        
        if (parseResult.data && parseResult.data.length > 0) {
          setAutoProcessingStatus('📥 Importing data...');
          const importResult = await onImport(parseResult.data);
          setResult(importResult);
          
          if (importResult.success) {
            setAutoProcessingStatus('✅ Import completed successfully!');
            toast({
              title: "Import Successful",
              description: `Successfully imported ${importResult.processed} ${title.toLowerCase()}.`,
            });
          } else {
            setAutoProcessingStatus('⚠️ Import completed with some issues');
            toast({
              title: "Import Completed with Issues",
              description: `Imported ${importResult.processed} items, but ${importResult.errors.length} had errors.`,
              variant: "destructive"
            });
          }
        }
      } else if (analysis.needsPreprocessing) {
        setAutoProcessingStatus('🤖 AI is enhancing your CSV for better compatibility...');
        setProcessingWithAI(true);

        console.log('🔧 CSV needs preprocessing, sending to AI...');
        const preprocessResult = await CSVAIPreprocessor.preprocessWithAI(text, title, requiredFields, fieldDescriptions);
        
        console.log('✨ AI preprocessing result:', preprocessResult);
        setProcessingDetails(prev => ({ ...prev, ...preprocessResult.analysisDetails }));

        if (preprocessResult.processedCSV) {
          setAutoProcessingStatus('✅ AI enhanced your CSV successfully! Parsing data...');
          setAiProcessedData(preprocessResult.processedCSV);
          
          // Parse the AI-processed CSV
          const parseResult = CSVParser.parse(preprocessResult.processedCSV);
          setParseResult(parseResult);
          
          if (parseResult.data && parseResult.data.length > 0) {
            console.log('📈 Using AI-processed data for import');
            setAutoProcessingStatus('📥 Importing enhanced data...');
            const importResult = await onImport(parseResult.data);
            setResult(importResult);
            
            if (importResult.success) {
              setAutoProcessingStatus('✅ Import completed successfully!');
              toast({
                title: "Import Successful",
                description: `Successfully imported ${importResult.processed} ${title.toLowerCase()} with AI enhancement.`,
              });
            } else {
              setAutoProcessingStatus('⚠️ Import completed with some issues');
              toast({
                title: "Import Completed with Issues",
                description: `Imported ${importResult.processed} items, but ${importResult.errors.length} had errors.`,
                variant: "destructive"
              });
            }
          } else {
            throw new Error('Failed to parse AI-processed CSV');
          }
        } else {
          // AI preprocessing failed, try original CSV
          console.log('⚠️ AI preprocessing failed, trying original CSV');
          setAutoProcessingStatus('⚠️ AI enhancement failed, trying original CSV...');
          
          const parseResult = CSVParser.parse(text);
          setParseResult(parseResult);
          
          if (parseResult.data && parseResult.data.length > 0) {
            setAutoProcessingStatus('📥 Importing original data...');
            const importResult = await onImport(parseResult.data);
            setResult(importResult);
            
            if (importResult.success) {
              setAutoProcessingStatus('✅ Import completed (original format)');
              toast({
                title: "Import Successful",
                description: `Successfully imported ${importResult.processed} ${title.toLowerCase()}.`,
              });
            } else {
              setAutoProcessingStatus('❌ Import had issues with original format');
              toast({
                title: "Import Issues",
                description: `Imported ${importResult.processed} items, but ${importResult.errors.length} had errors.`,
                variant: "destructive"
              });
            }
          } else {
            throw new Error('Failed to parse CSV');
          }
        }
      } else {
        // CSV doesn't need preprocessing
        console.log('✅ CSV looks good, parsing directly');
        setAutoProcessingStatus('✅ CSV format looks good! Parsing data...');
        
        const parseResult = CSVParser.parse(text);
        setParseResult(parseResult);
        
        if (parseResult.data && parseResult.data.length > 0) {
          setAutoProcessingStatus('📥 Importing data...');
          const importResult = await onImport(parseResult.data);
          setResult(importResult);
          
          if (importResult.success) {
            setAutoProcessingStatus('✅ Import completed successfully!');
            toast({
              title: "Import Successful",
              description: `Successfully imported ${importResult.processed} ${title.toLowerCase()}.`,
            });
          } else {
            setAutoProcessingStatus('⚠️ Import completed with some issues');
            toast({
              title: "Import Completed with Issues", 
              description: `Imported ${importResult.processed} items, but ${importResult.errors.length} had errors.`,
              variant: "destructive"
            });
          }
        } else {
          throw new Error('Failed to parse CSV');
        }
      }
    } catch (error) {
      console.error('❌ Import error:', error);
      setAutoProcessingStatus('❌ Import failed');
      setResult({
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
      
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setImporting(false);
      setProcessingWithAI(false);
    }
  };

  const handleImportFromProcessed = async (source: string) => {
    const dataToImport = source === 'processed' ? aiProcessedData : extractedData;
    if (!dataToImport) return;

    console.log(`🔄 Importing from ${source} data`);
    setImporting(true);
    setResult(null);

    try {
      const parseResult = CSVParser.parse(dataToImport);
      if (parseResult.data && parseResult.data.length > 0) {
        const importResult = await onImport(parseResult.data);
        setResult(importResult);
        
        if (importResult.success) {
          toast({
            title: "Import Successful",
            description: `Successfully imported ${importResult.processed} ${title.toLowerCase()}.`,
          });
        } else {
          toast({
            title: "Import Completed with Issues",
            description: `Imported ${importResult.processed} items, but ${importResult.errors.length} had errors.`,
            variant: "destructive"
          });
        }
      } else {
        throw new Error('Failed to parse data');
      }
    } catch (error) {
      console.error('Import error:', error);
      setResult({
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
      
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setImporting(false);
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

  const processCSVWithAI = async (csvText?: string) => {
    console.log('Manual CSV processing with AI...');
    setProcessingWithAI(true);

    try {
      let textToProcess = csvText || '';
      
      // If no csvText provided and we have a file, convert it first
      if (!csvText && file) {
        // Check if it's an Excel file
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          console.log('📊 Detected Excel file, converting to CSV for AI processing...');
          
          const arrayBuffer = await file.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          
          // Get the first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to CSV
          textToProcess = XLSX.utils.sheet_to_csv(worksheet);
          console.log('✅ Excel converted to CSV for AI processing');
        } else {
          // Regular CSV file
          textToProcess = await file.text();
        }
      }
      
      const result = await CSVAIPreprocessor.preprocessWithAI(
        textToProcess,
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
    processingDetails,
    fileInputRef,
    imageInputRef,
    handleImport,
    handleImportFromProcessed,
    extractDataFromImage,
    processCSVWithAI,
    reset
  };
};
