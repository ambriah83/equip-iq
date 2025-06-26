
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEquipmentTypes } from '@/hooks/useEquipmentTypes';
import { useLocations } from '@/hooks/useLocations';
import FieldDialog from './FieldDialog';
import { supabase } from '@/integrations/supabase/client';

const DropdownFieldsTab = () => {
  const { toast } = useToast();
  const { equipmentTypes, refetch: refetchEquipmentTypes } = useEquipmentTypes();
  const { locations, refetch: refetchLocations } = useLocations();
  
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<{type: string, category: string, field: any | null}>({ type: '', category: '', field: null });

  const handleSaveEquipmentType = async (fieldData: { label: string; value: string }) => {
    try {
      if (editingField.field) {
        // Update existing equipment type
        const { error } = await supabase
          .from('equipment_types')
          .update({ name: fieldData.label, description: fieldData.value })
          .eq('id', editingField.field.id);
        
        if (error) throw error;
        
        toast({
          title: "Equipment Type Updated",
          description: "Equipment type has been updated successfully.",
        });
      } else {
        // Create new equipment type
        const { error } = await supabase
          .from('equipment_types')
          .insert({ name: fieldData.label, description: fieldData.value });
        
        if (error) throw error;
        
        toast({
          title: "Equipment Type Added",
          description: "New equipment type has been added successfully.",
        });
      }
      
      refetchEquipmentTypes();
      setIsFieldDialogOpen(false);
      setEditingField({ type: '', category: '', field: null });
    } catch (error) {
      console.error('Error saving equipment type:', error);
      toast({
        title: "Error",
        description: "Failed to save equipment type. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEquipmentType = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipment_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Equipment Type Removed",
        description: "Equipment type has been removed successfully.",
      });
      
      refetchEquipmentTypes();
    } catch (error) {
      console.error('Error deleting equipment type:', error);
      toast({
        title: "Error",
        description: "Failed to delete equipment type. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Equipment Types */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Types</CardTitle>
          <CardDescription>Manage equipment type options for equipment management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Equipment Types</h4>
              <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingField({ type: 'equipment', category: 'types', field: null })}
                  >
                    <Plus size={14} className="mr-1" />
                    Add Equipment Type
                  </Button>
                </DialogTrigger>
                <FieldDialog
                  field={editingField.field}
                  onSave={handleSaveEquipmentType}
                  onClose={() => setIsFieldDialogOpen(false)}
                />
              </Dialog>
            </div>
            <div className="space-y-2">
              {equipmentTypes.map((type) => (
                <div key={type.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{type.name}</span>
                    {type.description && (
                      <p className="text-sm text-gray-600">{type.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingField({ 
                          type: 'equipment', 
                          category: 'types', 
                          field: { id: type.id, label: type.name, value: type.description || '' }
                        });
                        setIsFieldDialogOpen(true);
                      }}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEquipmentType(type.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Types - Static for now */}
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Other system dropdown configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Equipment Status Options</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• Active</div>
                <div>• Maintenance</div>
                <div>• Offline</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Warranty Status Options</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• Active</div>
                <div>• Inactive</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">TMAX Connection Types</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• Wired</div>
                <div>• Wireless</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DropdownFieldsTab;
