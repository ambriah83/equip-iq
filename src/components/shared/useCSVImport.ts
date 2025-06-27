import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { csvParser } from '@/utils/csvParser';
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
    setImporting(true);
    setResult(null);
    setAutoProcessingStatus('🔍 Analyzing CSV structure...');

    try {
      const text = await file.text();
      console.log('📄 File content loaded, size:', text.length);

      // Enhanced CSV analysis
      const analysis = CSVAIPreprocessor.analyzeCSVForPreprocessing(text, requiredFields, fieldDescriptions);
      setProcessingDetails(analysis.analysisDetails);
      
      console.log('📊 CSV Analysis completed:', analysis);

      if (analysis.needsPreprocessing) {
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
          const parseResult = csvParser.parse(preprocessResult.processedCSV);
          setParseResult(parseResult);
          
          if (parseResult.success && parseResult.data) {
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
          
          const parseResult = csvParser.parse(text);
          setParseResult(parseResult);
          
          if (parseResult.success && parseResult.data) {
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
            throw new Error(parseResult.error || 'Failed to parse CSV');
          }
        }
      } else {
        // CSV doesn't need preprocessing
        console.log('✅ CSV looks good, parsing directly');
        setAutoProcessingStatus('✅ CSV format looks good! Parsing data...');
        
        const parseResult = csvParser.parse(text);
        setParseResult(parseResult);
        
        if (parseResult.success && parseResult.data) {
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
          throw new Error(parseResult.error || 'Failed to parse CSV');
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
      const parseResult = csvParser.parse(dataToImport);
      if (parseResult.success && parseResult.data) {
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
        throw new Error(parseResult.error || 'Failed to parse data');
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
