
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCSVImport } from './useCSVImport';
import CSVDialogHeader from './CSVDialogHeader';
import CSVImportAlert from './CSVImportAlert';
import CSVImportTabs from './CSVImportTabs';
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
    autoProcessingStatus,
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
    await processCSVWithAI(csvText);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
        <CSVDialogHeader
          title={title}
          requiredFields={requiredFields}
          fieldDescriptions={fieldDescriptions}
        />

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            <CSVImportAlert />

            <CSVImportTabs
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
              autoProcessingStatus={autoProcessingStatus}
              imageFile={imageFile}
              setImageFile={setImageFile}
              imageInputRef={imageInputRef}
              extractingFromImage={extractingFromImage}
              extractedData={extractedData}
              setExtractedData={setExtractedData}
              onExtractData={extractDataFromImage}
              onClose={handleClose}
            />

            {result && <ImportResultAlert result={result} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportDialog;
