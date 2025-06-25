
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FileUploadProps {
  label: string;
  accept: string;
  multiple?: boolean;
  onFilesChange: (files: File[]) => void;
  existingFiles?: string[];
  type: 'image' | 'document';
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  multiple = false,
  onFilesChange,
  existingFiles = [],
  type
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
    onFilesChange(selectedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const getFileIcon = () => {
    return type === 'image' ? <Image size={16} /> : <FileText size={16} />;
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload size={16} className="mr-2" />
          Choose {multiple ? 'Files' : 'File'}
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {existingFiles.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Existing files:</Label>
            {existingFiles.map((file, index) => (
              <Badge key={index} variant="secondary" className="mr-2">
                {getFileIcon()}
                <span className="ml-1">{file}</span>
              </Badge>
            ))}
          </div>
        )}
        
        {files.length > 0 && (
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Selected files:</Label>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div className="flex items-center">
                  {getFileIcon()}
                  <span className="ml-2 text-sm">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
