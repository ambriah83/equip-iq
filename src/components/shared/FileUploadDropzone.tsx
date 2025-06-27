
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';

interface FileUploadDropzoneProps {
  onFileSelect: () => void;
  disabled: boolean;
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileSelect,
  disabled
}) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <div className="space-y-2">
        <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto" />
        <div>
          <Button
            variant="outline"
            onClick={onFileSelect}
            disabled={disabled}
          >
            Choose CSV/Excel File
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Or drag and drop your file here
        </p>
      </div>
    </div>
  );
};

export default FileUploadDropzone;
