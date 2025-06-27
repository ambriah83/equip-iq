
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, X, Loader2 } from 'lucide-react';

interface AIProcessedDataPreviewProps {
  data: string;
  onImport: () => void;
  onRemove: () => void;
  importing: boolean;
}

const AIProcessedDataPreview: React.FC<AIProcessedDataPreviewProps> = ({
  data,
  onImport,
  onRemove,
  importing
}) => {
  const formatPreviewData = (data: any) => {
    if (typeof data === 'string') {
      return data;
    }
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-green-500" />
            <span className="font-medium text-green-700">AI Enhanced Data</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onImport}
              disabled={importing}
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Import Enhanced Data'
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-32 border rounded">
          <pre className="text-xs p-2 whitespace-pre-wrap">
            {formatPreviewData(data)}
          </pre>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default AIProcessedDataPreview;
