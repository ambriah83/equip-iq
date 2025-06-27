
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface ProcessingStatusProps {
  status: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status }) => {
  return (
    <Alert className="border-blue-200 bg-blue-50">
      <Loader2 className="h-4 w-4 animate-spin" />
      <AlertDescription>
        <div className="flex items-center gap-2">
          <span className="font-medium">Processing Status:</span>
          <span>{status}</span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ProcessingStatus;
