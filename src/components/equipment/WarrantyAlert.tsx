
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface WarrantyAlertProps {
  equipment: Array<{
    id: string;
    name: string;
    warranty_status: string;
    warranty_expiry_date: string | null;
  }>;
}

const WarrantyAlert: React.FC<WarrantyAlertProps> = ({ equipment }) => {
  const expiringSoon = equipment.filter(eq => 
    eq.warranty_status === 'active' && 
    eq.warranty_expiry_date && 
    new Date(eq.warranty_expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  if (expiringSoon.length === 0) return null;

  return (
    <Alert className="mb-4 border-orange-500 bg-orange-50">
      <Shield className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">
        Warranties Expiring Soon!
      </AlertTitle>
      <AlertDescription className="text-orange-700">
        {expiringSoon.length} equipment warranties are expiring within 30 days:
        <ul className="mt-2 list-disc list-inside">
          {expiringSoon.map(eq => (
            <li key={eq.id}>{eq.name} - expires {new Date(eq.warranty_expiry_date!).toLocaleDateString()}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default WarrantyAlert;
