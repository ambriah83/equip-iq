
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WarrantyAlertProps {
  warranty: {
    status: 'active' | 'inactive';
    expiryDate?: string;
    documentation?: string[];
  };
  equipmentName: string;
}

const WarrantyAlert: React.FC<WarrantyAlertProps> = ({ warranty, equipmentName }) => {
  if (warranty.status !== 'active') return null;

  const isExpiringSoon = warranty.expiryDate && 
    new Date(warranty.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Alert className={`mb-4 ${isExpiringSoon ? 'border-orange-500 bg-orange-50' : 'border-green-500 bg-green-50'}`}>
      <Shield className={`h-4 w-4 ${isExpiringSoon ? 'text-orange-600' : 'text-green-600'}`} />
      <AlertTitle className={isExpiringSoon ? 'text-orange-800' : 'text-green-800'}>
        {isExpiringSoon ? 'Warranty Expiring Soon!' : 'Equipment Under Warranty'}
      </AlertTitle>
      <AlertDescription className={isExpiringSoon ? 'text-orange-700' : 'text-green-700'}>
        {equipmentName} is currently under warranty
        {warranty.expiryDate && (
          <span> until {new Date(warranty.expiryDate).toLocaleDateString()}</span>
        )}
        {isExpiringSoon && (
          <span className="font-semibold"> - Please review warranty status soon!</span>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default WarrantyAlert;
