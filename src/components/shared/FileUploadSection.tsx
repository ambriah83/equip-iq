
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, Loader2, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadSectionProps {
  file: File | null;
  setFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  sampleData: Record<string, any>;
  title: string;
  importing: boolean;
  processingWithAI: boolean;
  onImport: () => void;
  onProcessWithAI: (csvText: string) => void;
  aiProcessedData: string | null;
  setAiProcessedData: (data: string | null) => void;
  onImportFromProcessed: (source: string) => void;
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
  onImportFromProcessed
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const droppedFile = droppedFiles[0];
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    const isValidType = validTypes.includes(droppedFile.type) || 
                       droppedFile.name.endsWith('.csv') ||
                       droppedFile.name.endsWith('.xlsx') ||
                       droppedFile.name.endsWith('.xls');
    
    if (isValidType) {
      setFile(droppedFile);
      setAiProcessedData(null);
      console.log('Valid file dropped:', droppedFile.name);
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop a CSV or Excel file (.csv, .xlsx, .xls).",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log('File selected:', selectedFile?.name, selectedFile?.type);
    
    if (selectedFile) {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      const isValidType = validTypes.includes(selectedFile.type) || 
                         selectedFile.name.endsWith('.csv') ||
                         selectedFile.name.endsWith('.xlsx') ||
                         selectedFile.name.endsWith('.xls');
      
      if (isValidType) {
        setFile(selectedFile);
        setAiProcessedData(null);
        console.log('Valid file selected');
      } else {
        console.log('Invalid file type selected');
        toast({
          title: "Invalid File",
          description: "Please select a CSV or Excel file (.csv, .xlsx, .xls).",
          variant: "destructive"
        });
      }
    }
  };

  const downloadSample = () => {
    console.log('Downloading sample CSV for:', title);
    const headers = Object.keys(sampleData).join(',');
    const values = Object.values(sampleData).join(',');
    const csvContent = `${headers}\n${values}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(' ', '_')}_sample.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    console.log('Sample CSV downloaded');
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          <div className="space-y-2">
            <p>Upload any CSV file - don't worry about column names or format! Our AI will handle the mapping.</p>
            <div className="text-sm text-slate-600">
              <strong>Supported formats:</strong> CSV (.csv), Excel (.xlsx, .xls)*
              <br />
              <em>*Excel files: Please convert to CSV format for best results</em>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label>Upload File</Label>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload size={32} className={isDragOver ? 'text-blue-500' : 'text-gray-400'} />
            <div>
              <p className="text-sm font-medium">
                {isDragOver ? 'Drop your file here' : 'Drag and drop your file here, or click to browse'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Any CSV format works - AI will handle the mapping!
              </p>
            </div>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" onClick={downloadSample} size="sm">
            <Download size={16} className="mr-2" />
            Download Sample CSV
          </Button>
        </div>
        
        <div className="text-xs text-slate-500">
          <strong>Don't have the exact format?</strong> No problem! Upload any CSV and our AI will fix it automatically.
        </div>
      </div>

      {file && (
        <div className="p-3 bg-slate-50 rounded">
          <p className="text-sm">
            <strong>Selected file:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
          {(file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) && (
            <p className="text-xs text-amber-600 mt-1">
              ⚠️ Excel file detected. For best results, please convert to CSV format first.
            </p>
          )}
        </div>
      )}

      {aiProcessedData && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Zap size={16} className="text-blue-500" />
            AI-Processed Data Preview
          </Label>
          <div className="p-3 bg-slate-50 rounded max-h-32 overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap">{aiProcessedData}</pre>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAiProcessedData(null)}>
              Clear
            </Button>
            <Button 
              onClick={() => onImportFromProcessed('processed')} 
              disabled={importing}
            >
              {importing ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Import AI-Processed Data
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button 
          onClick={onImport} 
          disabled={!file || importing || processingWithAI}
        >
          {importing ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Processing...
            </>
          ) : processingWithAI ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              AI Processing...
            </>
          ) : (
            <>
              <Upload size={16} className="mr-2" />
              Import
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUploadSection;
