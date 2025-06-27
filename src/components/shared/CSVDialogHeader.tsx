
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, FileText, Camera, Zap } from 'lucide-react';

interface CSVDialogHeaderProps {
  title: string;
  requiredFields: string[];
  fieldDescriptions: Record<string, string>;
}

const CSVDialogHeader: React.FC<CSVDialogHeaderProps> = ({
  title,
  requiredFields,
  fieldDescriptions
}) => {
  return (
    <DialogHeader className="flex-shrink-0">
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
                        <span className="font-medium">CSV/Excel:</span> Advanced parser handles any CSV format including quoted fields and complex formatting
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Camera size={14} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Image:</span> AI extracts data from photos/screenshots of spreadsheets
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap size={14} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">AI Processing:</span> Automatically fixes format and mapping issues
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
                  <strong>New:</strong> Advanced CSV parser automatically handles quoted fields, escaped characters, and various delimiters!
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <DialogDescription className="text-sm text-gray-600">
        AI-powered import with automatic format detection and fixing for any CSV structure
      </DialogDescription>
    </DialogHeader>
  );
};

export default CSVDialogHeader;
