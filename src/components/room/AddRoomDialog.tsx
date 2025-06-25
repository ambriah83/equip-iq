
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRooms } from '@/hooks/useRooms';
import { Location } from '@/types/Location';
import FileUpload from '../FileUpload';

interface AddRoomDialogProps {
  locations: Location[];
}

const AddRoomDialog: React.FC<AddRoomDialogProps> = ({ locations }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { addRoom } = useRooms();
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    locationId: '',
  });
  const [floorPlan, setFloorPlan] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedLocation = locations.find(loc => loc.id === formData.locationId);
    if (!selectedLocation) {
      toast({
        title: "Error",
        description: "Please select a valid location.",
        variant: "destructive"
      });
      return;
    }

    const roomName = formData.name || `Room ${formData.number}`;
    
    addRoom({
      name: roomName,
      number: formData.number,
      locationId: formData.locationId,
      locationAbbreviation: selectedLocation.abbreviation,
      floorPlan: floorPlan.length > 0 ? floorPlan[0].name : undefined
    });
    
    toast({
      title: "Room Added",
      description: `${roomName} has been successfully added to ${selectedLocation.name}.`,
    });
    
    // Reset form and close dialog
    setFormData({
      name: '',
      number: '',
      locationId: '',
    });
    setFloorPlan([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus size={16} className="mr-2" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={formData.locationId} onValueChange={(value) => handleInputChange('locationId', value)}>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Room Number</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                placeholder="e.g. 3"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Room Name (Optional)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Main Tanning Room"
              />
            </div>
          </div>

          <FileUpload
            label="Room Floor Plan"
            accept="image/*"
            type="image"
            onFilesChange={setFloorPlan}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomDialog;
