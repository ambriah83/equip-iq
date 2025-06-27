
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, CheckCircle } from 'lucide-react';

const CSVImportAlert: React.FC = () => {
  return (
    <Alert className="border-green-200 bg-green-50">
      <Brain className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Enhanced Glo Tanning CSV Import System
          </p>
          <div className="text-sm">
            Your CSV will be automatically processed with enhanced column mapping:
            <ul className="list-disc list-inside mt-1 ml-2 space-y-1">
              <li><strong>"Tan-Link or SunLync"</strong> → Location abbreviation/code</li>
              <li><strong>"STORE MANAGER"</strong> → Manager name</li>
              <li><strong>"Direct Store Line"</strong> → Phone number</li>
              <li><strong>"Corporate or Franchise"</strong> → Ownership type</li>
              <li>Handles complex CSV structures with AI preprocessing</li>
              <li>Provides detailed error messages with column mapping suggestions</li>
            </ul>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default CSVImportAlert;
