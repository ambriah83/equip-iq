
import React from 'react';
import { Card } from "@/components/ui/card";
import { FileSpreadsheet } from 'lucide-react';
import FileUploadDropzone from './FileUploadDropzone';
import FileUploadPreview from './FileUploadPreview';
import ProcessingStatus from './ProcessingStatus';
import AIProcessedDataPreview from './AIProcessedDataPreview';
import SampleDataFormat from './SampleDataFormat';

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
  aiProcessedData,
  setAiProcessedData,
  onImportFromProcessed,
  autoProcessingStatus
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleImportProcessed = () => {
    onImportFromProcessed('processed');
  };

  const handleRemoveProcessedData = () => {
    setAiProcessedData(null);
  };

  const isDisabled = importing || processingWithAI;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Smart CSV Upload</span>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

          <FileUploadDropzone
            onFileSelect={handleFileSelect}
            disabled={isDisabled}
          />

          {file && (
            <>
              {autoProcessingStatus && (
                <ProcessingStatus status={autoProcessingStatus} />
              )}

              <FileUploadPreview
                file={file}
                onRemove={handleRemoveFile}
                onImport={onImport}
                importing={importing}
                processingWithAI={processingWithAI}
                title={title}
                disabled={isDisabled}
              />
            </>
          )}
        </div>
      </Card>

      {aiProcessedData && (
        <AIProcessedDataPreview
          data={aiProcessedData}
          onImport={handleImportProcessed}
          onRemove={handleRemoveProcessedData}
          importing={importing}
        />
      )}

      <SampleDataFormat sampleData={sampleData} />
    </div>
  );
};

export default FileUploadSection;
