
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLocations } from '@/hooks/useLocations';
import { useEquipmentTypes } from '@/hooks/useEquipmentTypes';
import FileUpload from './FileUpload';
import WarrantySection from './equipment/WarrantySection';

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  room: string;
  serialNumber: string;
  status: 'active' | 'maintenance' | 'offline';
  lastService: string;
  warranty: {
    status: 'active' | 'inactive';
    expiryDate?: string;
    documentation?: string[];
  };
  tmaxConnection?: 'Wired' | 'Wireless';
  equipmentPhoto?: string;
  documentation?: string[];
  roomLayout?: string;
  roomPhoto?: string;
}

interface EditEquipmentDialogProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateEquipment: (equipment: Equipment) => void;
}

const EditEquipmentDialog: React.FC<EditEquipmentDialogProps> = ({ 
  equipment, 
  open, 
  onOpenChange, 
  onUpdateEquipment 
}) => {
  const { toast } = useToast();
  const { locations } = useLocations();
  const { equipmentTypes } = useEquipmentTypes();
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    room: '',
    serialNumber: '',
    status: 'active' as 'active' | 'maintenance' | 'offline',
    lastService: '',
    warranty: {
      status: 'inactive' as 'active' | 'inactive',
      expiryDate: undefined as string | undefined,
      documentation: [] as string[]
    },
    tmaxConnection: ''
  });

  const [equipmentPhoto, setEquipmentPhoto] = useState<File[]>([]);
  const [documentation, setDocumentation] = useState<File[]>([]);
  const [warrantyDocumentation, setWarrantyDocumentation] = useState<File[]>([]);
  const [roomLayout, setRoomLayout] = useState<File[]>([]);
  const [roomPhoto, setRoomPhoto] = useState<File[]>([]);

  const tmaxConnections = ['Wired', 'Wireless'];
  const statuses = ['active', 'maintenance', 'offline'];

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        type: equipment.type,
        location: equipment.location,
        room: equipment.room,
        serialNumber: equipment.serialNumber,
        status: equipment.status,
        lastService: equipment.lastService,
        warranty: {
          status: equipment.warranty.status,
          expiryDate: equipment.warranty.expiryDate || undefined,
          documentation: equipment.warranty.documentation || []
        },
        tmaxConnection: equipment.tmaxConnection || ''
      });
    }
  }, [equipment]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWarrantyChange = (warranty: { status: 'active' | 'inactive'; expiryDate?: string; documentation?: string[] }) => {
    setFormData(prev => ({ 
      ...prev, 
      warranty: {
        status: warranty.status,
        expiryDate: warranty.expiryDate || undefined,
        documentation: warranty.documentation || []
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (equipment) {
      const updatedEquipment = {
        ...equipment,
        ...formData,
        tmaxConnection: formData.tmaxConnection as 'Wired' | 'Wireless'
      };
      onUpdateEquipment(updatedEquipment);
      
      toast({
        title: "Equipment Updated",
        description: `${formData.name} has been successfully updated.`,
      });
      
      onOpenChange(false);
    }
  };

  if (!equipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
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
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
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
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastService">Last Service Date</Label>
              <Input
                id="lastService"
                type="date"
                value={formData.lastService}
                onChange={(e) => handleInputChange('lastService', e.target.value)}
              />
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
              existingFiles={equipment.equipmentPhoto ? [equipment.equipmentPhoto] : []}
            />
            
            <FileUpload
              label="Documentation"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              type="document"
              onFilesChange={setDocumentation}
              existingFiles={equipment.documentation || []}
            />
            
            <FileUpload
              label="Room Layout"
              accept="image/*"
              type="image"
              onFilesChange={setRoomLayout}
              existingFiles={equipment.roomLayout ? [equipment.roomLayout] : []}
            />
            
            <FileUpload
              label="Room Photo"
              accept="image/*"
              type="image"
              onFilesChange={setRoomPhoto}
              existingFiles={equipment.roomPhoto ? [equipment.roomPhoto] : []}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Update Equipment
            </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEquipmentDialog;
