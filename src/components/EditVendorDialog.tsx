
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VendorForm from './vendor/VendorForm';
import { VendorWithContacts, UpdateVendorData } from '@/types/Vendor';

interface EditVendorDialogProps {
  vendor: VendorWithContacts | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateVendor: (vendor: UpdateVendorData) => void;
}

const EditVendorDialog: React.FC<EditVendorDialogProps> = ({ 
  vendor, 
  open, 
  onOpenChange, 
  onUpdateVendor 
}) => {
  const handleFormSubmit = (updatedVendor: UpdateVendorData) => {
    onUpdateVendor(updatedVendor);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
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
