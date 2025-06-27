
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface VendorFormData {
  company_name: string;
  contact_name: string;
  phone: string;
  website_email: string;
  vendor_department: string;
  equipment_type: string;
  equipment_name: string;
  notes: string;
}

interface VendorFormProps {
  onSubmit: (vendor: VendorFormData & { id: string }) => void;
  onCancel: () => void;
  initialData?: Partial<VendorFormData & { id: string }>;
  isEditing?: boolean;
}

const VendorForm: React.FC<VendorFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData = {},
  isEditing = false 
}) => {
  const [formData, setFormData] = useState<VendorFormData>({
    company_name: initialData.company_name || '',
    contact_name: initialData.contact_name || '',
    phone: initialData.phone || '',
    website_email: initialData.website_email || '',
    vendor_department: initialData.vendor_department || '',
    equipment_type: initialData.equipment_type || '',
    equipment_name: initialData.equipment_name || '',
    notes: initialData.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vendorData = {
      id: initialData.id || Date.now().toString(),
      ...formData
    };

    onSubmit(vendorData);
    
    if (!isEditing) {
      setFormData({
        company_name: '',
        contact_name: '',
        phone: '',
        website_email: '',
        vendor_department: '',
        equipment_type: '',
        equipment_name: '',
        notes: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="contact_name">Primary Contact</Label>
        <Input
          id="contact_name"
          value={formData.contact_name}
          onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
          placeholder="e.g., John Smith"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="e.g., 555-123-4567"
        />
      </div>

      <div>
        <Label htmlFor="website_email">Email Address</Label>
        <Input
          id="website_email"
          type="email"
          value={formData.website_email}
          onChange={(e) => setFormData({ ...formData, website_email: e.target.value })}
          placeholder="e.g., service@company.com"
        />
      </div>

      <div>
        <Label htmlFor="vendor_department">Department/Division</Label>
        <Input
          id="vendor_department"
          value={formData.vendor_department}
          onChange={(e) => setFormData({ ...formData, vendor_department: e.target.value })}
          placeholder="e.g., Service Department, Sales Division"
        />
      </div>

      <div>
        <Label htmlFor="equipment_type">Services/Specialization *</Label>
        <Input
          id="equipment_type"
          value={formData.equipment_type}
          onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
          placeholder="e.g., Tanning Bed Maintenance, HVAC Services, Plumbing"
          required
        />
      </div>

      <div>
        <Label htmlFor="equipment_name">Specific Equipment/Products</Label>
        <Input
          id="equipment_name"
          value={formData.equipment_name}
          onChange={(e) => setFormData({ ...formData, equipment_name: e.target.value })}
          placeholder="e.g., SunMaster Series, Carrier HVAC Units"
        />
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Additional information about this vendor, service agreements, preferred contact methods, etc."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Vendor' : 'Add Vendor'}
        </Button>
      </div>
    </form>
  );
};

export default VendorForm;
