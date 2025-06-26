
import React, { useState } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DropdownField {
  id: string;
  label: string;
  value: string;
}

interface FieldDialogProps {
  field: DropdownField | null;
  onSave: (data: { label: string; value: string }) => void;
  onClose: () => void;
}

const FieldDialog: React.FC<FieldDialogProps> = ({ field, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    label: field?.label || '',
    value: field?.value || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{field ? 'Edit Field' : 'Add New Field'}</DialogTitle>
        <DialogDescription>
          {field ? 'Update dropdown field' : 'Create a new dropdown option'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => setFormData({...formData, label: e.target.value})}
            placeholder="Display name"
            required
          />
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            value={formData.value}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
            placeholder="Internal value (lowercase, no spaces)"
            required
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {field ? 'Update Field' : 'Add Field'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default FieldDialog;
