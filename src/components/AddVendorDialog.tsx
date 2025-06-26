
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface AddVendorDialogProps {
  onAddVendor: (vendor: any) => void;
}

const AddVendorDialog: React.FC<AddVendorDialogProps> = ({ onAddVendor }) => {
  const [open, setOpen] = useState(false);
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVendor = {
      id: Date.now().toString(),
      ...formData
    };

    onAddVendor(newVendor);
    setFormData({
      equipment_type: '',
      equipment_name: '',
      company_name: '',
      vendor_department: '',
      contact_name: '',
      phone: '',
      website_email: '',
      notes: ''
    });
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="equipment_type">Equipment Type *</Label>
            <Input
              id="equipment_type"
              value={formData.equipment_type}
              onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
              placeholder="e.g., Tanning Bed, HVAC, Plumbing"
              required
            />
          </div>

          <div>
            <Label htmlFor="equipment_name">Equipment Name</Label>
            <Input
              id="equipment_name"
              value={formData.equipment_name}
              onChange={(e) => setFormData({ ...formData, equipment_name: e.target.value })}
              placeholder="e.g., SunMaster 3000"
            />
          </div>
          
          <div>
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="e.g., SunTech Solutions"
              required
            />
          </div>

          <div>
            <Label htmlFor="vendor_department">Vendor Department</Label>
            <Input
              id="vendor_department"
              value={formData.vendor_department}
              onChange={(e) => setFormData({ ...formData, vendor_department: e.target.value })}
              placeholder="e.g., Service Department"
            />
          </div>

          <div>
            <Label htmlFor="contact_name">Contact Name</Label>
            <Input
              id="contact_name"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              placeholder="e.g., John Smith"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g., 555-123-4567"
            />
          </div>

          <div>
            <Label htmlFor="website_email">Website/Email</Label>
            <Input
              id="website_email"
              type="email"
              value={formData.website_email}
              onChange={(e) => setFormData({ ...formData, website_email: e.target.value })}
              placeholder="e.g., service@company.com"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes about this vendor..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Vendor</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVendorDialog;
