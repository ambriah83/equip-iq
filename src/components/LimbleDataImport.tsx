import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Check, AlertCircle, Users, Building2, Wrench, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  importLocations, 
  importEquipment, 
  importVendors, 
  importUsers 
} from '@/services/limble-import-service';

interface ImportStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fileName: string;
  importFunction: (file: File) => Promise<any>;
  status: 'pending' | 'importing' | 'success' | 'error';
  result?: any;
}

export const LimbleDataImport = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  
  const [steps, setSteps] = useState<ImportStep[]>([
    {
      id: 'locations',
      title: 'Import Locations',
      description: 'Import all locations from Limble Assets.xlsx',
      icon: <Building2 className="h-5 w-5" />,
      fileName: 'Limble Assets.xlsx',
      importFunction: importLocations,
      status: 'pending'
    },
    {
      id: 'equipment',
      title: 'Import Equipment',
      description: 'Import all equipment and rooms from Limble Assets.xlsx',
      icon: <Wrench className="h-5 w-5" />,
      fileName: 'Limble Assets.xlsx',
      importFunction: importEquipment,
      status: 'pending'
    },
    {
      id: 'vendors',
      title: 'Import Vendors',
      description: 'Import vendor contacts from Vendor Contacts.xlsx',
      icon: <Package className="h-5 w-5" />,
      fileName: 'Vendor Contacts.xlsx',
      importFunction: importVendors,
      status: 'pending'
    },
    {
      id: 'users',
      title: 'Extract Users',
      description: 'Extract user list from Limble All Work Orders.xlsx',
      icon: <Users className="h-5 w-5" />,
      fileName: 'Limble All Work Orders.xlsx',
      importFunction: importUsers,
      status: 'pending'
    }
  ]);

  const handleFileSelect = async (stepIndex: number, file: File) => {
    const step = steps[stepIndex];
    
    // Update step status
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].status = 'importing';
    setSteps(updatedSteps);
    setIsImporting(true);

    try {
      const result = await step.importFunction(file);
      
      updatedSteps[stepIndex].status = result.success ? 'success' : 'error';
      updatedSteps[stepIndex].result = result;
      setSteps(updatedSteps);
      
      if (result.success) {
        toast({
          title: `${step.title} Complete`,
          description: `Successfully imported ${result.imported || result.total || 0} items`,
        });
        
        // Auto-advance to next step
        if (stepIndex < steps.length - 1) {
          setCurrentStep(stepIndex + 1);
        }
      } else {
        toast({
          title: `${step.title} Failed`,
          description: result.error || 'An error occurred during import',
          variant: 'destructive'
        });
      }
    } catch (error) {
      updatedSteps[stepIndex].status = 'error';
      setSteps(updatedSteps);
      
      toast({
        title: 'Import Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'importing':
        return <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />;
      default:
        return null;
    }
  };

  const completedSteps = steps.filter(s => s.status === 'success').length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Import Limble Data</CardTitle>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              {completedSteps} of {steps.length} steps completed
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Before starting:</strong> Make sure you have these files ready:
              <ul className="list-disc list-inside mt-2">
                <li>Limble Assets.xlsx</li>
                <li>Vendor Contacts.xlsx</li>
                <li>Limble All Work Orders.xlsx (optional)</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card 
                key={step.id} 
                className={`border-2 transition-all ${
                  index === currentStep 
                    ? 'border-blue-500 shadow-lg' 
                    : step.status === 'success'
                    ? 'border-green-200 bg-green-50'
                    : step.status === 'error'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {step.title}
                          {getStepIcon(step.status)}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {step.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Required file: <span className="font-mono">{step.fileName}</span>
                        </p>
                        
                        {step.result && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                            {step.result.success ? (
                              <div className="text-green-700">
                                ✓ Imported: {step.result.imported || step.result.total || 0} items
                                {step.result.rooms && ` (${step.result.rooms} rooms)`}
                              </div>
                            ) : (
                              <div className="text-red-700">
                                ✗ Error: {step.result.error}
                              </div>
                            )}
                            {step.result.note && (
                              <div className="text-gray-600 mt-1">
                                Note: {step.result.note}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      {index === currentStep && step.status !== 'success' && (
                        <label 
                          htmlFor={`file-input-${step.id}`}
                          className="cursor-pointer"
                        >
                          <input
                            id={`file-input-${step.id}`}
                            type="file"
                            accept=".xlsx,.xls"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileSelect(index, file);
                              }
                            }}
                            disabled={isImporting}
                          />
                          <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                            <Upload className="h-4 w-4 mr-2" />
                            {isImporting ? 'Importing...' : 'Select File'}
                          </div>
                        </label>
                      )}
                      
                      {step.status === 'success' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep(index)}
                        >
                          Re-import
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {completedSteps === steps.length && (
            <Alert className="mt-6 border-green-200 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>Import complete!</strong> All data has been successfully imported.
                You can now manage your locations, equipment, and vendors in EquipIQ.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};