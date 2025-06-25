
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import FileUpload from '../FileUpload';

interface WarrantySectionProps {
  warranty: {
    status: 'active' | 'inactive';
    expiryDate?: string;
    documentation?: string[];
  };
  onWarrantyChange: (warranty: { status: 'active' | 'inactive'; expiryDate?: string; documentation?: string[] }) => void;
  onWarrantyDocsChange: (files: File[]) => void;
}

const WarrantySection: React.FC<WarrantySectionProps> = ({ 
  warranty, 
  onWarrantyChange, 
  onWarrantyDocsChange 
}) => {
  const handleStatusChange = (status: 'active' | 'inactive') => {
    onWarrantyChange({
      ...warranty,
      status,
      expiryDate: status === 'inactive' ? undefined : warranty.expiryDate
    });
  };

  const handleExpiryDateChange = (expiryDate: string) => {
    onWarrantyChange({
      ...warranty,
      expiryDate
    });
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
      <h3 className="text-lg font-medium flex items-center gap-2">
        Warranty Information
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="warrantyStatus">Warranty Status</Label>
          <Select value={warranty.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select warranty status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {warranty.status === 'active' && (
          <div className="space-y-2">
            <Label htmlFor="warrantyExpiry">Warranty Expiry Date</Label>
            <Input
              id="warrantyExpiry"
              type="date"
              value={warranty.expiryDate || ''}
              onChange={(e) => handleExpiryDateChange(e.target.value)}
              required
            />
          </div>
        )}

        <FileUpload
          label="Warranty Documentation"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          type="document"
          onFilesChange={onWarrantyDocsChange}
          existingFiles={warranty.documentation || []}
        />
      </div>
    </div>
  );
};

export default WarrantySection;
