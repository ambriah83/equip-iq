
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSpreadsheet, FileText, Camera, Info, Zap } from 'lucide-react';
import { useCSVImport } from './useCSVImport';
import FileUploadSection from './FileUploadSection';
import ImageUploadSection from './ImageUploadSection';
import ImportResultAlert from './ImportResultAlert';

interface ImportResult {
  success: boolean;
  processed: number;
  errors: string[];
}

interface CSVImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onImport: (data: any[]) => Promise<ImportResult>;
  sampleData: Record<string, any>;
  requiredFields: string[];
  fieldDescriptions: Record<string, string>;
}

const CSVImportDialog: React.FC<CSVImportDialogProps> = ({
  isOpen,
  onClose,
  title,
  onImport,
  sampleData,
  requiredFields,
  fieldDescriptions
}) => {
  const {
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
    fileInputRef,
    imageInputRef,
    handleImport,
    handleImportFromProcessed,
    extractDataFromImage,
    processCSVWithAI,
    reset
  } = useCSVImport({ title, onImport, requiredFields, fieldDescriptions });

  const handleClose = () => {
    console.log('Closing import dialog');
    reset();
    onClose();
  };

  const handleProcessWithAI = async (csvText: string) => {
    if (file) {
      const text = await file.text();
      await processCSVWithAI(text);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <DialogTitle>Import {title}</DialogTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-1">
                    <Info size={16} className="text-blue-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-md p-4" side="bottom">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-base mb-2">Import Options:</p>
                      <div className="text-sm space-y-2">
                        <div className="flex items-start gap-2">
                          <FileText size={14} className="mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">CSV/Excel:</span> Advanced parser handles any CSV format including quoted fields and complex formatting
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Camera size={14} className="mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Image:</span> AI extracts data from photos/screenshots of spreadsheets
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Zap size={14} className="mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">AI Processing:</span> Automatically fixes format and mapping issues
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-base mb-2">Required Fields:</p>
                      <div className="text-sm space-y-1">
                        {requiredFields.map(field => (
                          <div key={field} className="border-l-2 border-blue-200 pl-2">
                            <span className="font-medium">{field}:</span> {fieldDescriptions[field]}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-3 p-2 bg-blue-50 rounded">
                      <strong>New:</strong> Advanced CSV parser automatically handles quoted fields, escaped characters, and various delimiters!
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            Import {title.toLowerCase()} from any CSV format with advanced parsing or extract data from images using AI
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">✨ Advanced CSV Parser + AI-Powered Import</p>
                  <div className="text-sm">
                    Now featuring a robust CSV parser that handles:
                    <ul className="list-disc list-inside mt-1 ml-2">
                      <li>Quoted fields with commas, semicolons, and special characters</li>
                      <li>Automatic delimiter detection (comma, semicolon, tab)</li>
                      <li>Escaped quotes and complex CSV formatting</li>
                      <li>AI backup for any remaining mapping issues</li>
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <FileSpreadsheet size={16} />
                  File Upload
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <Camera size={16} />
                  Image Extract
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4">
                <FileUploadSection
                  file={file}
                  setFile={setFile}
                  fileInputRef={fileInputRef}
                  sampleData={sampleData}
                  title={title}
                  importing={importing}
                  processingWithAI={processingWithAI}
                  onImport={handleImport}
                  onProcessWithAI={handleProcessWithAI}
                  aiProcessedData={aiProcessedData}
                  setAiProcessedData={setAiProcessedData}
                  onImportFromProcessed={handleImportFromProcessed}
                  parseResult={parseResult}
                />
                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <ImageUploadSection
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  imageInputRef={imageInputRef}
                  extractingFromImage={extractingFromImage}
                  extractedData={extractedData}
                  setExtractedData={setExtractedData}
                  onExtractData={extractDataFromImage}
                  onImportFromProcessed={handleImportFromProcessed}
                  importing={importing}
                />
                {!extractedData && (
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {result && <ImportResultAlert result={result} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportDialog;
