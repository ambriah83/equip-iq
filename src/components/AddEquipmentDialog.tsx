import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';
import WarrantySection from './equipment/WarrantySection';

const AddEquipmentDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    room: '',
    serialNumber: '',
    warranty: {
      status: 'inactive' as 'active' | 'inactive',
      expiryDate: '',
      documentation: [] as string[]
    },
    tmaxConnection: '',
  });
  
  const [equipmentPhoto, setEquipmentPhoto] = useState<File[]>([]);
  const [documentation, setDocumentation] = useState<File[]>([]);
  const [warrantyDocumentation, setWarrantyDocumentation] = useState<File[]>([]);
  const [roomLayout, setRoomLayout] = useState<File[]>([]);
  const [roomPhoto, setRoomPhoto] = useState<File[]>([]);

  const equipmentTypes = [
    'Sun',
    'Spray',
    'Spa',
    'Red Light',
    'Other',
    'HVAC',
    'Washer',
    'Dryer',
  ];

  const locations = [
    'Location A',
    'Location B', 
    'Location C',
  ];

  const tmaxConnections = [
    'Wired',
    'Wireless',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWarrantyChange = (warranty: { status: 'active' | 'inactive'; expiryDate?: string; documentation?: string[] }) => {
    setFormData(prev => ({ ...prev, warranty }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Adding equipment:', {
      ...formData,
      equipmentPhoto,
      documentation,
      warrantyDocumentation,
      roomLayout,
      roomPhoto,
    });
    
    toast({
      title: "Equipment Added",
      description: `${formData.name} has been successfully added to the system.`,
    });
    
    // Reset form and close dialog
    setFormData({
      name: '',
      type: '',
      location: '',
      room: '',
      serialNumber: '',
      warranty: {
        status: 'inactive',
        expiryDate: '',
        documentation: []
      },
      tmaxConnection: '',
    });
    setEquipmentPhoto([]);
    setDocumentation([]);
    setWarrantyDocumentation([]);
    setRoomLayout([]);
    setRoomPhoto([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-blue-600 hover:bg-blue-50">
          <Plus size={20} className="mr-2" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Tanning Bed #4"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) => handleInputChange('room', e.target.value)}
                placeholder="e.g. Room 3"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                placeholder="e.g. TB-2024-004"
                required
              />
            </div>
            
          </div>

          <div className="space-y-2">
            <Label htmlFor="tmaxConnection">TMAX Connection</Label>
            <Select value={formData.tmaxConnection} onValueChange={(value) => handleInputChange('tmaxConnection', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select connection type" />
              </SelectTrigger>
              <SelectContent>
                {tmaxConnections.map((connection) => (
                  <SelectItem key={connection} value={connection}>
                    {connection}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <WarrantySection
            warranty={formData.warranty}
            onWarrantyChange={handleWarrantyChange}
            onWarrantyDocsChange={setWarrantyDocumentation}
          />

          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Media & Documentation</h3>
            
            <FileUpload
              label="Equipment Photo"
              accept="image/*"
              type="image"
              onFilesChange={setEquipmentPhoto}
            />
            
            <FileUpload
              label="Documentation"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              type="document"
              onFilesChange={setDocumentation}
            />
            
            <FileUpload
              label="Room Layout"
              accept="image/*"
              type="image"
              onFilesChange={setRoomLayout}
            />
            
            <FileUpload
              label="Room Photo"
              accept="image/*"
              type="image"
              onFilesChange={setRoomPhoto}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Equipment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEquipmentDialog;
