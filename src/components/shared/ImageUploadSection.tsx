
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadSectionProps {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
  extractingFromImage: boolean;
  extractedData: string | null;
  setExtractedData: (data: string | null) => void;
  onExtractData: () => void;
  onImportFromProcessed: (source: string) => void;
  importing: boolean;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  imageFile,
  setImageFile,
  imageInputRef,
  extractingFromImage,
  extractedData,
  setExtractedData,
  onExtractData,
  onImportFromProcessed,
  importing
}) => {
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsImageDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsImageDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsImageDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const droppedFile = droppedFiles[0];
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (validImageTypes.includes(droppedFile.type)) {
      setImageFile(droppedFile);
      setExtractedData(null);
      console.log('Valid image dropped:', droppedFile.name);
    } else {
      toast({
        title: "Invalid File",
        description: "Please drop an image file (.jpg, .jpeg, .png, .webp).",
        variant: "destructive"
      });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log('Image selected:', selectedFile?.name, selectedFile?.type);
    
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (validTypes.includes(selectedFile.type)) {
        setImageFile(selectedFile);
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

  return (
    <div className="space-y-4">
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
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
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
              onClick={onExtractData} 
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
          <div className="p-3 bg-slate-50 rounded max-h-32 overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap">{extractedData}</pre>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setExtractedData(null)}>
              Clear
            </Button>
            <Button 
              onClick={() => onImportFromProcessed('extracted')} 
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
    </div>
  );
};

export default ImageUploadSection;
