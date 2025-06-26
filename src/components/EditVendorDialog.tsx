
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
  const [formData, setFormData] = useState({
    equipment_type: '',
    equipment_name: '',
    company_name: '',
    vendor_department: '',
    contact_name: '',
    phone: '',
    website_email: '',
    notes: ''
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        equipment_type: vendor.equipment_type || '',
        equipment_name: vendor.equipment_name || '',
        company_name: vendor.company_name || '',
        vendor_department: vendor.vendor_department || '',
        contact_name: vendor.contact_name || '',
        phone: vendor.phone || '',
        website_email: vendor.website_email || '',
        notes: vendor.notes || ''
      });
    }
  }, [vendor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (vendor) {
      const updatedVendor = {
        ...vendor,
        ...formData
      };
      onUpdateVendor(updatedVendor);
      onOpenChange(false);
    }
  };

  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vendor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="equipment_type">Equipment Type *</Label>
            <Input
              id="equipment_type"
              value={formData.equipment_type}
              onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="equipment_name">Equipment Name</Label>
            <Input
              id="equipment_name"
              value={formData.equipment_name}
              onChange={(e) => setFormData({ ...formData, equipment_name: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="vendor_department">Vendor Department</Label>
            <Input
              id="vendor_department"
              value={formData.vendor_department}
              onChange={(e) => setFormData({ ...formData, vendor_department: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="contact_name">Contact Name</Label>
            <Input
              id="contact_name"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="website_email">Website/Email</Label>
            <Input
              id="website_email"
              type="email"
              value={formData.website_email}
              onChange={(e) => setFormData({ ...formData, website_email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Vendor</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVendorDialog;
