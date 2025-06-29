
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLocations } from '@/hooks/useLocations';
import { useSupabaseRooms } from '@/hooks/useSupabaseRooms';
import { useEquipmentTypes } from '@/hooks/useEquipmentTypes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Equipment } from '@/types/Equipment';

interface EditEquipmentDialogProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEquipmentUpdated: () => void;
}

const EditEquipmentDialog: React.FC<EditEquipmentDialogProps> = ({
  equipment,
  open,
  onOpenChange,
  onEquipmentUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const { locations } = useLocations();
  const { rooms } = useSupabaseRooms();
  const { equipmentTypes } = useEquipmentTypes();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    serial_number: '',
    equipment_type_id: '',
    location_id: '',
    room_id: '',
    status: 'active',
    warranty_status: 'inactive',
    warranty_expiry_date: null as Date | null,
    last_service_date: null as Date | null,
  });

  // Update form data when equipment changes
  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        serial_number: equipment.serial_number || '',
        equipment_type_id: equipment.equipment_type_id || '',
        location_id: equipment.location_id || '',
        room_id: equipment.room_id || '',
        status: equipment.status || 'active',
        warranty_status: equipment.warranty_status || 'inactive',
        warranty_expiry_date: equipment.warranty_expiry_date ? new Date(equipment.warranty_expiry_date) : null,
        last_service_date: equipment.last_service_date ? new Date(equipment.last_service_date) : null,
      });
    }
  }, [equipment]);

  // Filter rooms based on selected location
  const availableRooms = rooms.filter(room => room.location_id === formData.location_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!equipment || !formData.name || !formData.equipment_type_id || !formData.location_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const equipmentData = {
        name: formData.name,
        serial_number: formData.serial_number || null,
        equipment_type_id: formData.equipment_type_id,
        location_id: formData.location_id,
        room_id: formData.room_id || null,
        status: formData.status,
        warranty_status: formData.warranty_status,
        warranty_expiry_date: formData.warranty_expiry_date?.toISOString().split('T')[0] || null,
        last_service_date: formData.last_service_date?.toISOString().split('T')[0] || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('equipment')
        .update(equipmentData)
        .eq('id', equipment.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Equipment updated successfully",
      });

      onEquipmentUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        title: "Error",
        description: "Failed to update equipment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!equipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>
            Update equipment information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter equipment name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input
                id="serial_number"
                value={formData.serial_number}
                onChange={(e) => setFormData(prev => ({ ...prev, serial_number: e.target.value }))}
                placeholder="Enter serial number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipment_type">Equipment Type *</Label>
              <Select 
                value={formData.equipment_type_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, equipment_type_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment type" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select 
                value={formData.location_id} 
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, location_id: value, room_id: '' }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name} ({location.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room">Room (Optional)</Label>
              <Select 
                value={formData.room_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, room_id: value }))}
                disabled={!formData.location_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warranty_status">Warranty Status</Label>
              <Select 
                value={formData.warranty_status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, warranty_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Warranty Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.warranty_expiry_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.warranty_expiry_date ? format(formData.warranty_expiry_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.warranty_expiry_date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, warranty_expiry_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Last Service Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.last_service_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.last_service_date ? format(formData.last_service_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.last_service_date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, last_service_date: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Equipment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEquipmentDialog;
