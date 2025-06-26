
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import RoleDialog from './RoleDialog';
import PermissionDialog from './PermissionDialog';

type UserRole = Database['public']['Enums']['user_role'];
type EscalationPermission = Database['public']['Enums']['escalation_permission'];

interface RolePermission {
  role: UserRole;
  permission: EscalationPermission;
  is_allowed: boolean;
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

const roleColors: Record<UserRole, string> = {
  owner: 'bg-purple-100 text-purple-800 border-purple-200',
  admin: 'bg-blue-100 text-blue-800 border-blue-200',
  manager: 'bg-green-100 text-green-800 border-green-200',
  staff: 'bg-orange-100 text-orange-800 border-orange-200',
  vendor: 'bg-gray-100 text-gray-800 border-gray-200'
};

const PermissionsTab = () => {
  const { toast } = useToast();
  
  // Mock data - in real app this would come from the database
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([
    // Owner permissions
    { role: 'owner', permission: 'can_use_ladder', is_allowed: true },
    { role: 'owner', permission: 'can_handle_electrical', is_allowed: true },
    { role: 'owner', permission: 'can_disassemble_parts', is_allowed: true },
    { role: 'owner', permission: 'can_work_at_height', is_allowed: true },
    { role: 'owner', permission: 'can_handle_chemicals', is_allowed: true },
    { role: 'owner', permission: 'can_operate_heavy_equipment', is_allowed: true },
    { role: 'owner', permission: 'can_access_restricted_areas', is_allowed: true },
    { role: 'owner', permission: 'can_perform_emergency_shutdowns', is_allowed: true },
    // Admin permissions
    { role: 'admin', permission: 'can_use_ladder', is_allowed: true },
    { role: 'admin', permission: 'can_handle_electrical', is_allowed: true },
    { role: 'admin', permission: 'can_disassemble_parts', is_allowed: true },
    { role: 'admin', permission: 'can_work_at_height', is_allowed: true },
    { role: 'admin', permission: 'can_handle_chemicals', is_allowed: false },
    { role: 'admin', permission: 'can_operate_heavy_equipment', is_allowed: true },
    { role: 'admin', permission: 'can_access_restricted_areas', is_allowed: true },
    { role: 'admin', permission: 'can_perform_emergency_shutdowns', is_allowed: true },
    // Manager permissions  
    { role: 'manager', permission: 'can_use_ladder', is_allowed: true },
    { role: 'manager', permission: 'can_handle_electrical', is_allowed: false },
    { role: 'manager', permission: 'can_disassemble_parts', is_allowed: true },
    { role: 'manager', permission: 'can_work_at_height', is_allowed: true },
    { role: 'manager', permission: 'can_handle_chemicals', is_allowed: false },
    { role: 'manager', permission: 'can_operate_heavy_equipment', is_allowed: false },
    { role: 'manager', permission: 'can_access_restricted_areas', is_allowed: true },
    { role: 'manager', permission: 'can_perform_emergency_shutdowns', is_allowed: true },
    // Staff permissions
    { role: 'staff', permission: 'can_use_ladder', is_allowed: true },
    { role: 'staff', permission: 'can_handle_electrical', is_allowed: false },
    { role: 'staff', permission: 'can_disassemble_parts', is_allowed: true },
    { role: 'staff', permission: 'can_work_at_height', is_allowed: false },
    { role: 'staff', permission: 'can_handle_chemicals', is_allowed: false },
    { role: 'staff', permission: 'can_operate_heavy_equipment', is_allowed: false },
    { role: 'staff', permission: 'can_access_restricted_areas', is_allowed: false },
    { role: 'staff', permission: 'can_perform_emergency_shutdowns', is_allowed: false },
  ]);

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  const roles: UserRole[] = ['owner', 'admin', 'manager', 'staff', 'vendor'];
  const permissions = Object.keys(permissionDescriptions) as EscalationPermission[];

  const handlePermissionToggle = (role: UserRole, permission: EscalationPermission, newValue: boolean) => {
    setRolePermissions(prev => 
      prev.map(rp => 
        rp.role === role && rp.permission === permission 
          ? { ...rp, is_allowed: newValue }
          : rp
      )
    );
    
    toast({
      title: "Permission Updated",
      description: `${permission.replace('can_', '').replace('_', ' ')} permission for ${role} has been ${newValue ? 'granted' : 'revoked'}.`,
    });
  };

  const getPermissionForRole = (role: UserRole, permission: EscalationPermission) => {
    const rolePermission = rolePermissions.find(rp => rp.role === role && rp.permission === permission);
    return rolePermission?.is_allowed || false;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Role-Based Permission Management</CardTitle>
            <CardDescription>
              Manage default permissions for each role. Individual users can have custom overrides.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus size={16} className="mr-2" />
                  Add Permission
                </Button>
              </DialogTrigger>
              <PermissionDialog onClose={() => setIsPermissionDialogOpen(false)} />
            </Dialog>
            <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <RoleDialog onClose={() => setIsRoleDialogOpen(false)} />
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {roles.map((role) => (
            <Card key={role} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded text-sm font-medium border ${roleColors[role]}`}>
                    {role.toUpperCase()}
                  </div>
                  <h3 className="text-lg font-semibold">Role Permissions</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissions.map((permission) => {
                  const isAllowed = getPermissionForRole(role, permission);
                  
                  return (
                    <div key={permission} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <Label className="font-medium text-sm">
                          {permission.replace('can_', '').replace(/_/g, ' ').toUpperCase()}
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          {permissionDescriptions[permission]}
                        </p>
                      </div>
                      <Switch
                        checked={isAllowed}
                        onCheckedChange={(checked) => 
                          handlePermissionToggle(role, permission, checked)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsTab;
