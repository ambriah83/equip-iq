
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import FieldDialog from './FieldDialog';

interface DropdownField {
  id: string;
  label: string;
  value: string;
}

interface DropdownFields {
  types: DropdownField[];
  statuses: DropdownField[];
  priorities: DropdownField[];
}

interface VendorDropdownFields {
  types: DropdownField[];
  specialties: DropdownField[];
}

const DropdownFieldsTab = () => {
  const { toast } = useToast();
  
  const [equipmentFields, setEquipmentFields] = useLocalStorage<DropdownFields>('equipment-fields', {
    types: [
      { id: '1', label: 'HVAC System', value: 'hvac' },
      { id: '2', label: 'Elevator', value: 'elevator' },
      { id: '3', label: 'Fire Safety', value: 'fire-safety' },
      { id: '4', label: 'Security System', value: 'security' }
    ],
    statuses: [
      { id: '1', label: 'Operational', value: 'operational' },
      { id: '2', label: 'Maintenance Required', value: 'maintenance' },
      { id: '3', label: 'Out of Service', value: 'out-of-service' }
    ],
    priorities: [
      { id: '1', label: 'Low', value: 'low' },
      { id: '2', label: 'Medium', value: 'medium' },
      { id: '3', label: 'High', value: 'high' },
      { id: '4', label: 'Critical', value: 'critical' }
    ]
  });

  const [vendorFields, setVendorFields] = useLocalStorage<VendorDropdownFields>('vendor-fields', {
    types: [
      { id: '1', label: 'HVAC Contractor', value: 'hvac-contractor' },
      { id: '2', label: 'Electrical Contractor', value: 'electrical' },
      { id: '3', label: 'Plumbing Contractor', value: 'plumbing' },
      { id: '4', label: 'General Maintenance', value: 'general' }
    ],
    specialties: [
      { id: '1', label: 'Emergency Services', value: 'emergency' },
      { id: '2', label: 'Preventive Maintenance', value: 'preventive' },
      { id: '3', label: 'Installation', value: 'installation' },
      { id: '4', label: 'Repair', value: 'repair' }
    ]
  });

  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<{type: string, category: string, field: DropdownField | null}>({ type: '', category: '', field: null });

  const handleSaveField = (fieldData: { label: string; value: string }) => {
    const { type, category, field } = editingField;
    
    if (field) {
      // Edit existing field
      if (type === 'equipment') {
        setEquipmentFields(prev => ({
          ...prev,
          [category]: prev[category as keyof typeof prev].map(f => 
            f.id === field.id ? { ...f, ...fieldData } : f
          )
        }));
      } else {
        setVendorFields(prev => ({
          ...prev,
          [category]: prev[category as keyof typeof prev].map(f => 
            f.id === field.id ? { ...f, ...fieldData } : f
          )
        }));
      }
    } else {
      // Add new field
      const newField: DropdownField = {
        id: Date.now().toString(),
        ...fieldData
      };
      
      if (type === 'equipment') {
        setEquipmentFields(prev => ({
          ...prev,
          [category]: [...prev[category as keyof typeof prev], newField]
        }));
      } else {
        setVendorFields(prev => ({
          ...prev,
          [category]: [...prev[category as keyof typeof prev], newField]
        }));
      }
    }
    
    toast({
      title: field ? "Field Updated" : "Field Added",
      description: `Dropdown field has been ${field ? 'updated' : 'added'} successfully.`,
    });
    
    setIsFieldDialogOpen(false);
    setEditingField({ type: '', category: '', field: null });
  };

  const handleDeleteField = (type: string, category: string, fieldId: string) => {
    if (type === 'equipment') {
      setEquipmentFields(prev => ({
        ...prev,
        [category]: prev[category as keyof typeof prev].filter(f => f.id !== fieldId)
      }));
    } else {
      setVendorFields(prev => ({
        ...prev,
        [category]: prev[category as keyof typeof prev].filter(f => f.id !== fieldId)
      }));
    }
    
    toast({
      title: "Field Removed",
      description: "Dropdown field has been removed successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Equipment Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Dropdown Fields</CardTitle>
          <CardDescription>Configure dropdown options for equipment management</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(equipmentFields).map(([category, fields]) => (
            <div key={category} className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</h4>
                <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingField({ type: 'equipment', category, field: null })}
                    >
                      <Plus size={14} className="mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <FieldDialog
                    field={editingField.field}
                    onSave={handleSaveField}
                    onClose={() => setIsFieldDialogOpen(false)}
                  />
                </Dialog>
              </div>
              <div className="space-y-2">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{field.label}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingField({ type: 'equipment', category, field });
                          setIsFieldDialogOpen(true);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteField('equipment', category, field.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Vendor Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Dropdown Fields</CardTitle>
          <CardDescription>Configure dropdown options for vendor management</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(vendorFields).map(([category, fields]) => (
            <div key={category} className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</h4>
                <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingField({ type: 'vendor', category, field: null })}
                    >
                      <Plus size={14} className="mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <FieldDialog
                    field={editingField.field}
                    onSave={handleSaveField}
                    onClose={() => setIsFieldDialogOpen(false)}
                  />
                </Dialog>
              </div>
              <div className="space-y-2">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{field.label}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingField({ type: 'vendor', category, field });
                          setIsFieldDialogOpen(true);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteField('vendor', category, field.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DropdownFieldsTab;
