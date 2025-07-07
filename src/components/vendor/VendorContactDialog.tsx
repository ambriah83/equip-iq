import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVendorContacts } from '@/hooks/useVendorContacts';
import { VendorContact, CONTACT_ROLES, CreateVendorContactData, UpdateVendorContactData } from '@/types/VendorContact';

interface VendorContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorId: string;
  contact?: VendorContact | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const VendorContactDialog: React.FC<VendorContactDialogProps> = ({
  open,
  onOpenChange,
  vendorId,
  contact,
  onClose,
  onSuccess
}) => {
  const { addContact, updateContact } = useVendorContacts();
  const [formData, setFormData] = useState({
    contact_name: '',
    role: '',
    email: '',
    phone: '',
    is_primary: false
  });
  const [loading, setLoading] = useState(false);

  const isEditing = !!contact;

  useEffect(() => {
    if (contact) {
      setFormData({
        contact_name: contact.contact_name,
        role: contact.role || '',
        email: contact.email || '',
        phone: contact.phone || '',
        is_primary: contact.is_primary
      });
    } else {
      setFormData({
        contact_name: '',
        role: '',
        email: '',
        phone: '',
        is_primary: false
      });
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contact_name.trim()) {
      return;
    }

    setLoading(true);
    try {
      if (isEditing && contact) {
        const updateData: UpdateVendorContactData = {
          contact_name: formData.contact_name.trim(),
          role: formData.role.trim() || undefined,
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          is_primary: formData.is_primary
        };
        await updateContact(contact.id, updateData);
      } else {
        const createData: CreateVendorContactData = {
          vendor_id: vendorId,
          contact_name: formData.contact_name.trim(),
          role: formData.role.trim() || undefined,
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          is_primary: formData.is_primary
        };
        await addContact(createData);
      }
      onSuccess();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Contact' : 'Add New Contact'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact_name">Contact Name *</Label>
            <Input
              id="contact_name"
              value={formData.contact_name}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
              placeholder="Enter contact name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_primary"
              checked={formData.is_primary}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_primary: checked }))}
            />
            <Label htmlFor="is_primary">Set as primary contact</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update Contact' : 'Add Contact')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};