
import React, { useState, useEffect } from 'react';
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
  const [isValueManuallyChanged, setIsValueManuallyChanged] = useState(false);

  // Auto-format value based on label when label changes (only if value hasn't been manually edited)
  useEffect(() => {
    if (!isValueManuallyChanged && formData.label) {
      const formattedValue = formData.label
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters except spaces
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with single underscore
        .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
      
      setFormData(prev => ({ ...prev, value: formattedValue }));
    }
  }, [formData.label, isValueManuallyChanged]);

  // Reset manual change tracking when field changes (for edit mode)
  useEffect(() => {
    setIsValueManuallyChanged(false);
  }, [field]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, label: e.target.value });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, value: e.target.value });
    setIsValueManuallyChanged(true);
  };

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
            onChange={handleLabelChange}
            placeholder="Display name"
            required
          />
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            value={formData.value}
            onChange={handleValueChange}
            placeholder="Internal value (lowercase, no spaces)"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Auto-generated from label. You can edit this manually if needed.
          </p>
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
