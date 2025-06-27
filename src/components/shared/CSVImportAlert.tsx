
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain } from 'lucide-react';

const CSVImportAlert: React.FC = () => {
  return (
    <Alert className="border-green-200 bg-green-50">
      <Brain className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium">🚀 AI-First Import System</p>
          <div className="text-sm">
            Your CSV will be automatically analyzed and fixed before import:
            <ul className="list-disc list-inside mt-1 ml-2">
              <li>Detects column mapping issues (like "Location Name" vs "name")</li>
              <li>Fixes formatting problems automatically</li>
              <li>Handles complex CSV structures seamlessly</li>
              <li>No manual intervention required</li>
            </ul>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default CSVImportAlert;
