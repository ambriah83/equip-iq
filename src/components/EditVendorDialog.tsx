
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettings } from '@/contexts/SettingsContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Vendor {
  id: string;
  name: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  preferredContact: string;
  isFirstChoice: boolean;
  rating: number;
  lastContacted: string;
  communicationLog: any[];
  serviceLocations?: string[];
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
  const { settings } = useSettings();
  
  // Get locations from localStorage
  const [locations] = useLocalStorage('locations', []);
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    preferredContact: 'phone',
    serviceLocations: [] as string[]
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        type: vendor.type,
        phone: vendor.phone,
        email: vendor.email,
        address: vendor.address,
        notes: vendor.notes,
        preferredContact: vendor.preferredContact,
        serviceLocations: vendor.serviceLocations || []
      });
    }
  }, [vendor]);

  const handleLocationToggle = (locationId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        serviceLocations: [...prev.serviceLocations, locationId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        serviceLocations: prev.serviceLocations.filter(id => id !== locationId)
      }));
    }
  };

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
            <Label htmlFor="name">Vendor Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select vendor type" />
              </SelectTrigger>
              <SelectContent>
                {settings.vendorTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="preferredContact">Preferred Contact Method</Label>
            <Select value={formData.preferredContact} onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Service Locations</Label>
            <div className="border rounded-lg p-3 space-y-2 max-h-32 overflow-y-auto">
              {locations.length > 0 ? (
                locations.map((location: any) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location.id}`}
                      checked={formData.serviceLocations.includes(location.id)}
                      onCheckedChange={(checked) => handleLocationToggle(location.id, checked as boolean)}
                    />
                    <Label htmlFor={`location-${location.id}`} className="text-sm font-normal">
                      {location.name} {location.abbreviation && `(${location.abbreviation})`}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No locations available. Add locations first.</p>
              )}
            </div>
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
