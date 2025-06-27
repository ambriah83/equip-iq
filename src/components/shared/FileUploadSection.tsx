import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText, Upload, X, Info, Brain, Loader2 } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadSectionProps {
  file: File | null;
  setFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  sampleData: Record<string, any>;
  title: string;
  importing: boolean;
  processingWithAI: boolean;
  onImport: () => void;
  onProcessWithAI: (csvText: string) => Promise<void>;
  aiProcessedData: string | null;
  setAiProcessedData: (data: string | null) => void;
  onImportFromProcessed: (source: string) => Promise<void>;
  parseResult: any;
  autoProcessingStatus: string | null;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  setFile,
  fileInputRef,
  sampleData,
  title,
  importing,
  processingWithAI,
  onImport,
  onProcessWithAI,
  aiProcessedData,
  setAiProcessedData,
  onImportFromProcessed,
  parseResult,
  autoProcessingStatus
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const formatPreviewData = (data: any) => {
    if (typeof data === 'string') {
      return data;
    }
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Smart CSV Upload</span>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="space-y-2">
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing || processingWithAI}
                >
                  Choose CSV/Excel File
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Or drag and drop your file here
              </p>
            </div>
          </div>

          {file && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  disabled={importing || processingWithAI}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {autoProcessingStatus && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Processing Status:</span>
                      <span>{autoProcessingStatus}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={onImport}
                  disabled={importing || processingWithAI}
                  className="flex-1"
                >
                  {importing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {processingWithAI ? 'AI Processing...' : 'Importing...'}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Import {title}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* AI Processed Data Preview */}
      {aiProcessedData && (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-700">AI Enhanced Data</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onImportFromProcessed('processed')}
                  disabled={importing}
                >
                  {importing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Import Enhanced Data'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiProcessedData(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-32 border rounded">
              <pre className="text-xs p-2 whitespace-pre-wrap">
                {formatPreviewData(aiProcessedData)}
              </pre>
            </ScrollArea>
          </div>
        </Card>
      )}

      {/* Sample Data Format */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Expected CSV Format</span>
          </div>
          <ScrollArea className="h-32 border rounded">
            <pre className="text-xs p-2 whitespace-pre-wrap">
              {Object.keys(sampleData).join(',')}
              {'\n'}
              {Object.values(sampleData).map(value => 
                typeof value === 'string' && value.includes(',') 
                  ? `"${value}"` 
                  : value
              ).join(',')}
            </pre>
          </ScrollArea>
          <p className="text-xs text-gray-500">
            Your CSV should have these columns. The AI will automatically map similar column names.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default FileUploadSection;
