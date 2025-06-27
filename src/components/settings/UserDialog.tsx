
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePermissions } from '@/hooks/usePermissions';
import { Database } from '@/integrations/supabase/types';
import { User } from '@/types/User';
import UserBasicInfo from './UserBasicInfo';
import UserLocationAccess from './UserLocationAccess';
import UserPermissions from './UserPermissions';

type UserRole = Database['public']['Enums']['user_role'];
type EscalationPermission = Database['public']['Enums']['escalation_permission'];

interface UserDialogProps {
  user: User | null;
  onSave: (data: User) => void;
  onClose: () => void;
}

const UserDialog: React.FC<UserDialogProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: User['role'];
    status: User['status'];
  }>({
    name: '',
    email: '',
    role: 'employee',
    status: 'active'
  });

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const {
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
        role: 'employee',
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
    const userData: User = {
      id: user?.id || crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status
    };
    onSave(userData);
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

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogDescription>
          {user ? 'Update user information, permissions, and location access' : 'Create a new user account'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <UserBasicInfo formData={formData} setFormData={setFormData} />

        <Separator />

        <UserLocationAccess 
          selectedLocations={selectedLocations}
          onLocationToggle={handleLocationToggle}
        />

        <Separator />

        <UserPermissions 
          user={user}
          userRole={formData.role as UserRole}
          onPermissionToggle={handlePermissionToggle}
        />

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
