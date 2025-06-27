
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info } from 'lucide-react';

interface SampleDataFormatProps {
  sampleData: Record<string, any>;
}

const SampleDataFormat: React.FC<SampleDataFormatProps> = ({ sampleData }) => {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-500" />
          <span className="font-medium">Expected CSV Format</span>
        </div>
        <ScrollArea className="h-32 border rounded">
          <pre className="text-xs p-2 whitespace-pre-wrap">
            {Object.keys(sampleData).join(',')}
            {'\n'}
            {Object.values(sampleData).map(value => 
              typeof value === 'string' && value.includes(',') 
                ? `"${value}"` 
                : value
            ).join(',')}
          </pre>
        </ScrollArea>
        <p className="text-xs text-gray-500">
          Your CSV should have these columns. The AI will automatically map similar column names.
        </p>
      </div>
    </Card>
  );
};

export default SampleDataFormat;
