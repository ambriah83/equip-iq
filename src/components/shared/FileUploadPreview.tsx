
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, X, Upload, Loader2 } from 'lucide-react';

interface FileUploadPreviewProps {
  file: File;
  onRemove: () => void;
  onImport: () => void;
  importing: boolean;
  processingWithAI: boolean;
  title: string;
  disabled: boolean;
}

const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({
  file,
  onRemove,
  onImport,
  importing,
  processingWithAI,
  title,
  disabled
}) => {
  return (
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
          onClick={onRemove}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onImport}
          disabled={disabled}
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
  );
};

export default FileUploadPreview;
