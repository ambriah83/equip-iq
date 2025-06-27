
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Camera } from 'lucide-react';
import FileUploadSection from './FileUploadSection';
import ImageUploadSection from './ImageUploadSection';

interface CSVImportTabsProps {
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
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
  extractingFromImage: boolean;
  extractedData: string | null;
  setExtractedData: (data: string | null) => void;
  onExtractData: () => Promise<void>;
  onClose: () => void;
}

const CSVImportTabs: React.FC<CSVImportTabsProps> = ({
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
  autoProcessingStatus,
  imageFile,
  setImageFile,
  imageInputRef,
  extractingFromImage,
  extractedData,
  setExtractedData,
  onExtractData,
  onClose
}) => {
  return (
    <Tabs defaultValue="file" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="file" className="flex items-center gap-2">
          <FileSpreadsheet size={16} />
          Smart File Upload
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
          onImport={onImport}
          onProcessWithAI={onProcessWithAI}
          aiProcessedData={aiProcessedData}
          setAiProcessedData={setAiProcessedData}
          onImportFromProcessed={onImportFromProcessed}
          parseResult={parseResult}
          autoProcessingStatus={autoProcessingStatus}
        />
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
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
          onExtractData={onExtractData}
          onImportFromProcessed={onImportFromProcessed}
          importing={importing}
        />
        {!extractedData && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default CSVImportTabs;
