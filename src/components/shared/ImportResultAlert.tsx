
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

interface ImportResult {
  success: boolean;
  processed: number;
  errors: string[];
}

interface ImportResultAlertProps {
  result: ImportResult;
}

const ImportResultAlert: React.FC<ImportResultAlertProps> = ({ result }) => {
  return (
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
  );
};

export default ImportResultAlert;
