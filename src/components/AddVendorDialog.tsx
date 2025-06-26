
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VendorForm from './vendor/VendorForm';

interface AddVendorDialogProps {
  onAddVendor: (vendor: any) => void;
}

const AddVendorDialog: React.FC<AddVendorDialogProps> = ({ onAddVendor }) => {
  const [open, setOpen] = useState(false);

  const handleFormSubmit = (vendor: any) => {
    onAddVendor(vendor);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Add Vendor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
        </DialogHeader>
        <VendorForm 
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddVendorDialog;
