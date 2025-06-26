import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, HelpCircle, CheckCircle, XCircle, FileSpreadsheet, FileText, Camera, Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [extractingFromImage, setExtractingFromImage] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [extractedData, setExtractedData] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent, isImage: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    if (isImage) {
      setIsImageDragOver(true);
    } else {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, isImage: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    if (isImage) {
      setIsImageDragOver(false);
    } else {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent, isImage: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isImage) {
      setIsImageDragOver(false);
    } else {
      setIsDragOver(false);
    }

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const droppedFile = droppedFiles[0];

    if (isImage) {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (validImageTypes.includes(droppedFile.type)) {
        setImageFile(droppedFile);
        setResult(null);
        setExtractedData(null);
        console.log('Valid image dropped:', droppedFile.name);
      } else {
        toast({
          title: "Invalid File",
          description: "Please drop an image file (.jpg, .jpeg, .png, .webp).",
          variant: "destructive"
        });
      }
    } else {
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
        setResult(null);
        console.log('Valid file dropped:', droppedFile.name);
      } else {
        toast({
          title: "Invalid File",
          description: "Please drop a CSV or Excel file (.csv, .xlsx, .xls).",
          variant: "destructive"
        });
      }
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
        setResult(null);
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log('Image selected:', selectedFile?.name, selectedFile?.type);
    
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (validTypes.includes(selectedFile.type)) {
        setImageFile(selectedFile);
        setResult(null);
        setExtractedData(null);
        console.log('Valid image selected');
      } else {
        console.log('Invalid image type selected');
        toast({
          title: "Invalid File",
          description: "Please select an image file (.jpg, .jpeg, .png, .webp).",
          variant: "destructive"
        });
      }
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

  const parseExcel = async (file: File): Promise<any[]> => {
    console.log('Parsing Excel file...');
    // For now, we'll show a helpful message about Excel files
    // In a real implementation, you'd use a library like xlsx or similar
    throw new Error('Excel file parsing is not yet implemented. Please convert your Excel file to CSV format and try again.');
  };

  const extractDataFromImage = async () => {
    if (!imageFile) return;

    console.log('Starting image data extraction...');
    setExtractingFromImage(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      console.log('Image converted to base64, calling extraction function...');

      const { data, error } = await supabase.functions.invoke('extract-data-from-image', {
        body: {
          imageData: imageDataUrl,
          dataType: title.toLowerCase(),
          requiredFields
        }
      });

      if (error) {
        throw error;
      }

      console.log('Extraction result:', data);

      if (data.success && data.csvData) {
        setExtractedData(data.csvData);
        toast({
          title: "Data Extracted",
          description: "Successfully extracted data from image. Review and import if correct.",
        });
      } else {
        toast({
          title: "Extraction Failed",
          description: data.message || "Could not extract structured data from the image.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Image extraction error:', error);
      toast({
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "An error occurred while extracting data from the image.",
        variant: "destructive"
      });
    } finally {
      setExtractingFromImage(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Starting import process...');
    setImporting(true);
    
    try {
      let data: any[] = [];
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        data = await parseExcel(file);
      } else {
        const text = await file.text();
        console.log('File content read successfully');
        data = parseCSV(text);
      }
      
      if (data.length === 0) {
        console.log('No data found in file');
        toast({
          title: "No Data",
          description: "The file appears to be empty or invalid.",
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
        description: error instanceof Error ? error.message : "An error occurred while importing the file.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleImportFromExtracted = async () => {
    if (!extractedData) return;

    console.log('Importing extracted data...');
    setImporting(true);

    try {
      const data = parseCSV(extractedData);
      
      if (data.length === 0) {
        console.log('No data found in extracted text');
        toast({
          title: "No Data",
          description: "The extracted data appears to be empty or invalid.",
          variant: "destructive"
        });
        return;
      }

      console.log('Calling onImport with extracted data:', data.length, 'rows');
      const result = await onImport(data);
      console.log('Import result:', result);
      
      setResult(result);

      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${result.processed} records from image.`,
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
        description: error instanceof Error ? error.message : "An error occurred while importing the data.",
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
    setImageFile(null);
    setExtractedData(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
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
                            <span className="font-medium">CSV/Excel:</span> Upload files directly from your computer
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Camera size={14} className="mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-medium">Image:</span> AI extracts data from photos/screenshots of spreadsheets
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
                      <strong>Tip:</strong> The AI image extraction works great with screenshots of spreadsheets, tables, or any organized data.
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            Import {title.toLowerCase()} from CSV files or extract data from images using AI
          </DialogDescription>
        </DialogHeader>

        {/* Show required fields prominently */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Required fields for {title}:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {requiredFields.map(field => (
                  <div key={field} className="flex items-start gap-2">
                    <span className="font-medium min-w-0 text-blue-700">{field}:</span>
                    <span className="text-gray-700">{fieldDescriptions[field]}</span>
                  </div>
                ))}
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
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p>Upload a CSV file with the required columns. Required fields: {requiredFields.join(', ')}</p>
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
                onDragOver={(e) => handleDragOver(e, false)}
                onDragLeave={(e) => handleDragLeave(e, false)}
                onDrop={(e) => handleDrop(e, false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload size={32} className={isDragOver ? 'text-blue-500' : 'text-gray-400'} />
                  <div>
                    <p className="text-sm font-medium">
                      {isDragOver ? 'Drop your file here' : 'Drag and drop your file here, or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports CSV, Excel (.xlsx, .xls)
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
                <strong>Google Sheets users:</strong> File → Download → CSV (.csv)
                <br />
                <strong>Excel users:</strong> Save As → CSV (Comma delimited)
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

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!file || importing}
              >
                {importing ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Import
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p>Upload an image containing tabular data. AI will extract and structure the data for import.</p>
                  <div className="text-sm text-slate-600">
                    <strong>Supported formats:</strong> JPG, PNG, WebP
                    <br />
                    <em>Works best with clear, high-contrast images of tables or spreadsheets</em>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isImageDragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={(e) => handleDragOver(e, true)}
                onDragLeave={(e) => handleDragLeave(e, true)}
                onDrop={(e) => handleDrop(e, true)}
                onClick={() => imageInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <Camera size={32} className={isImageDragOver ? 'text-blue-500' : 'text-gray-400'} />
                  <div>
                    <p className="text-sm font-medium">
                      {isImageDragOver ? 'Drop your image here' : 'Drag and drop your image here, or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports JPG, PNG, WebP
                    </p>
                  </div>
                </div>
                <Input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              <div className="text-xs text-slate-500">
                <strong>Tips:</strong> Ensure text is clear and readable. Screenshots of spreadsheets work well.
              </div>
            </div>

            {imageFile && (
              <div className="p-3 bg-slate-50 rounded">
                <p className="text-sm">
                  <strong>Selected image:</strong> {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                </p>
                <div className="mt-2">
                  <Button 
                    onClick={extractDataFromImage} 
                    disabled={extractingFromImage}
                    size="sm"
                  >
                    {extractingFromImage ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Camera size={16} className="mr-2" />
                        Extract Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {extractedData && (
              <div className="space-y-2">
                <Label>Extracted Data Preview</Label>
                <div className="p-3 bg-slate-50 rounded max-h-40 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap">{extractedData}</pre>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setExtractedData(null)}>
                    Clear
                  </Button>
                  <Button 
                    onClick={handleImportFromExtracted} 
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
                        Import Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {!extractedData && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportDialog;
