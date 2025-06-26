
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Upload, Download, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log('File selected:', selectedFile?.name, selectedFile?.type);
    
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
      console.log('Valid CSV file selected');
    } else {
      console.log('Invalid file type selected');
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file.",
        variant: "destructive"
      });
    }
  };

  const parseCSV = (text: string): any[] => {
    console.log('Parsing CSV text, length:', text.length);
    const lines = text.split('\n').filter(line => line.trim());
    console.log('Found lines:', lines.length);
    
    if (lines.length < 2) {
      console.log('Not enough lines in CSV');
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    console.log('Headers found:', headers);
    
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }

    console.log('Parsed data:', data);
    return data;
  };

  const handleImport = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Starting import process...');
    setImporting(true);
    
    try {
      const text = await file.text();
      console.log('File content read successfully');
      
      const data = parseCSV(text);
      
      if (data.length === 0) {
        console.log('No data found in CSV');
        toast({
          title: "No Data",
          description: "The CSV file appears to be empty or invalid.",
          variant: "destructive"
        });
        return;
      }

      console.log('Calling onImport with data:', data.length, 'rows');
      const result = await onImport(data);
      console.log('Import result:', result);
      
      setResult(result);

      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.processed} records.`,
        });
      } else {
        toast({
          title: "Import Completed with Errors",
          description: `Processed ${result.processed} records with ${result.errors.length} errors.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "An error occurred while importing the file.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
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

  const handleClose = () => {
    console.log('Closing import dialog');
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Import {title}</DialogTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle size={16} className="text-slate-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-md">
                  <div className="space-y-2">
                    <p className="font-semibold">Required Format:</p>
                    <div className="text-sm space-y-1">
                      {requiredFields.map(field => (
                        <div key={field}>
                          <strong>{field}:</strong> {fieldDescriptions[field]}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      Download the sample CSV below to see the exact format required.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Upload a CSV file with the required columns. Required fields: {requiredFields.join(', ')}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>CSV File</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button variant="outline" onClick={downloadSample}>
                <Download size={16} className="mr-2" />
                Sample
              </Button>
            </div>
          </div>

          {file && (
            <div className="p-3 bg-slate-50 rounded">
              <p className="text-sm">
                <strong>Selected file:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            </div>
          )}

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle size={16} className="text-green-600 mt-0.5" />
                ) : (
                  <XCircle size={16} className="text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>Processed {result.processed} records</p>
                      {result.errors.length > 0 && (
                        <div>
                          <p className="font-semibold text-red-700">Errors:</p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {result.errors.slice(0, 5).map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                            {result.errors.length > 5 && (
                              <li>... and {result.errors.length - 5} more errors</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file || importing}
            >
              {importing ? (
                <>Processing...</>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Import
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportDialog;
