
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { usePermissions } from '@/hooks/usePermissions';
import { useLocations } from '@/hooks/useLocations';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type EscalationPermission = Database['public']['Enums']['escalation_permission'];

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'manager' | 'staff';
  status: 'active' | 'inactive';
}

interface UserDialogProps {
  user: User | null;
  onSave: (data: Partial<User>) => void;
  onClose: () => void;
}

const permissionDescriptions: Record<EscalationPermission, string> = {
  can_use_ladder: 'Permission to use ladders and elevated platforms',
  can_handle_electrical: 'Permission to work with electrical systems',
  can_disassemble_parts: 'Permission to disassemble equipment parts',
  can_work_at_height: 'Permission to work at dangerous heights',
  can_handle_chemicals: 'Permission to handle hazardous chemicals',
  can_operate_heavy_equipment: 'Permission to operate heavy machinery',
  can_access_restricted_areas: 'Permission to access restricted facility areas',
  can_perform_emergency_shutdowns: 'Permission to perform emergency system shutdowns'
};

const UserDialog: React.FC<UserDialogProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: 'admin' | 'owner' | 'manager' | 'staff';
    status: 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    role: 'staff',
    status: 'active'
  });

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const { locations } = useLocations();

  const {
    permissions,
    roleDefaults,
    loading,
    getPermissionStatus,
    updateUserPermission,
    fetchRoleDefaults
  } = usePermissions(user?.id, formData.role as UserRole);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
      // TODO: Load user's location access from database
      setSelectedLocations([]);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'staff',
        status: 'active'
      });
      setSelectedLocations([]);
    }
  }, [user]);

  // Fetch role defaults when role changes
  useEffect(() => {
    if (formData.role) {
      fetchRoleDefaults();
    }
  }, [formData.role, fetchRoleDefaults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePermissionToggle = async (permission: EscalationPermission, newValue: boolean) => {
    if (!user) return;
    
    try {
      await updateUserPermission(user.id, formData.role as UserRole, permission, newValue);
    } catch (error) {
      console.error('Failed to update permission:', error);
    }
  };

  const handleLocationToggle = (locationId: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations(prev => [...prev, locationId]);
    } else {
      setSelectedLocations(prev => prev.filter(id => id !== locationId));
    }
  };

  // Get permission status, falling back to role defaults if no custom permission exists
  const getEffectivePermissionStatus = (permission: EscalationPermission) => {
    if (user) {
      return getPermissionStatus(permission);
    } else {
      // For new users, show role defaults
      const roleDefault = roleDefaults.find(rd => rd.permission === permission);
      return {
        permission,
        is_allowed: roleDefault?.is_allowed || false,
        is_custom: false
      };
    }
  };

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogDescription>
          {user ? 'Update user information, permissions, and location access' : 'Create a new user account'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value: 'admin' | 'owner' | 'manager' | 'staff') => setFormData({...formData, role: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Location Access Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Location Access</h3>
          <p className="text-sm text-gray-600">
            Select which locations this user can access
          </p>
          
          <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location.id}`}
                  checked={selectedLocations.includes(location.id)}
                  onCheckedChange={(checked) => 
                    handleLocationToggle(location.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`location-${location.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {location.name} ({location.abbreviation})
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* User Permissions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User Permissions</h3>
          <p className="text-sm text-gray-600">
            Customize permissions for this user. These override the default role permissions.
            {!user && ' (Showing default permissions for selected role)'}
          </p>
          
          {loading && user ? (
            <div className="text-center py-4">Loading permissions...</div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {Object.entries(permissionDescriptions).map(([permission, description]) => {
                const permStatus = getEffectivePermissionStatus(permission as EscalationPermission);
                
                return (
                  <div key={permission} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {permission.replace('can_', '').replace(/_/g, ' ').toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-600">{description}</div>
                      {user && permStatus.is_custom && (
                        <div className="text-xs text-blue-600 mt-1">Custom override applied</div>
                      )}
                      {!user && (
                        <div className="text-xs text-green-600 mt-1">Role default</div>
                      )}
                    </div>
                    <Switch
                      checked={permStatus.is_allowed}
                      onCheckedChange={(checked) => {
                        if (user) {
                          handlePermissionToggle(permission as EscalationPermission, checked);
                        }
                      }}
                      disabled={!user} // Disable for new users, they'll get role defaults
                    />
                  </div>
                );
              })}
            </div>
          )}
          
          {!user && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                New users will receive the default permissions for their assigned role. You can customize these permissions after creating the user.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {user ? 'Update User' : 'Add User'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default UserDialog;
