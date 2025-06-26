
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VendorForm from './vendor/VendorForm';

interface Vendor {
  id: string;
  equipment_type: string;
  equipment_name?: string;
  company_name: string;
  vendor_department?: string;
  contact_name?: string;
  phone?: string;
  website_email?: string;
  notes?: string;
}

interface EditVendorDialogProps {
  vendor: Vendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateVendor: (vendor: Vendor) => void;
}

const EditVendorDialog: React.FC<EditVendorDialogProps> = ({ 
  vendor, 
  open, 
  onOpenChange, 
  onUpdateVendor 
}) => {
  const handleFormSubmit = (updatedVendor: Vendor) => {
    onUpdateVendor(updatedVendor);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vendor</DialogTitle>
        </DialogHeader>
        <VendorForm 
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          initialData={vendor}
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditVendorDialog;
