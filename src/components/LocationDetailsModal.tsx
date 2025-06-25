
import React, { useState } from 'react';
import { Building2, MapPin, Users, Wrench, AlertTriangle, Edit, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Location {
  id: string;
  name: string;
  address: string;
  manager: string;
  equipmentCount: number;
  activeIssues: number;
  status: 'active' | 'maintenance' | 'closed';
  lastUpdated: string;
}

interface LocationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
  mode: 'view' | 'manage';
  onLocationUpdate?: (location: Location) => void;
}

const LocationDetailsModal = ({ 
  isOpen, 
  onClose, 
  location, 
  mode, 
  onLocationUpdate 
}: LocationDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(mode === 'manage');
  const [editedLocation, setEditedLocation] = useState<Location | null>(location);

  React.useEffect(() => {
    setEditedLocation(location);
    setIsEditing(mode === 'manage');
  }, [location, mode]);

  if (!location || !editedLocation) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = () => {
    if (onLocationUpdate && editedLocation) {
      onLocationUpdate(editedLocation);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedLocation(location);
    setIsEditing(false);
  };

  const mockEquipment = [
    { id: 1, name: 'Tanning Bed #1', type: 'Level 3', status: 'Active', lastMaintenance: '2024-01-20' },
    { id: 2, name: 'Tanning Bed #2', type: 'Level 4', status: 'Maintenance', lastMaintenance: '2024-01-15' },
    { id: 3, name: 'HVAC System', type: 'Cooling', status: 'Active', lastMaintenance: '2024-01-18' },
  ];

  const mockIssues = [
    { id: 1, equipment: 'Tanning Bed #2', issue: 'Timer malfunction', priority: 'High', reported: '2 hours ago' },
    { id: 2, equipment: 'HVAC System', issue: 'Temperature fluctuation', priority: 'Medium', reported: '1 day ago' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Building2 size={24} />
              {isEditing ? 'Manage Location' : 'Location Details'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {mode === 'view' && !isEditing && (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit size={16} />
                  Edit
                </Button>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <Save size={16} />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Location Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedLocation.name}
                      onChange={(e) => setEditedLocation({
                        ...editedLocation,
                        name: e.target.value
                      })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{location.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="manager">Manager</Label>
                  {isEditing ? (
                    <Input
                      id="manager"
                      value={editedLocation.manager}
                      onChange={(e) => setEditedLocation({
                        ...editedLocation,
                        manager: e.target.value
                      })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{location.manager}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={editedLocation.address}
                    onChange={(e) => setEditedLocation({
                      ...editedLocation,
                      address: e.target.value
                    })}
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={16} className="text-slate-500" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <Label>Status</Label>
                  {isEditing ? (
                    <select
                      value={editedLocation.status}
                      onChange={(e) => setEditedLocation({
                        ...editedLocation,
                        status: e.target.value as 'active' | 'maintenance' | 'closed'
                      })}
                      className="block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="closed">Closed</option>
                    </select>
                  ) : (
                    <div className="mt-1">
                      <Badge className={getStatusColor(location.status)}>
                        {location.status}
                      </Badge>
                    </div>
                  )}
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-sm mt-1">{location.lastUpdated}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Wrench className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600">Equipment</p>
                    <p className="text-2xl font-bold">{location.equipmentCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm text-slate-600">Active Issues</p>
                    <p className="text-2xl font-bold">{location.activeIssues}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-slate-600">Staff</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipment List */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockEquipment.map((equipment) => (
                  <div key={equipment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">{equipment.name}</p>
                      <p className="text-sm text-slate-600">{equipment.type}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={equipment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {equipment.status}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">Last: {equipment.lastMaintenance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Issues */}
          {location.activeIssues > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockIssues.map((issue) => (
                    <div key={issue.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium">{issue.equipment}</p>
                        <p className="text-sm text-slate-600">{issue.issue}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={issue.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {issue.priority}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">{issue.reported}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDetailsModal;
