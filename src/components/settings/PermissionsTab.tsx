import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RolePermissionMatrix from './RolePermissionMatrix';
import RolesList from './RolesList';
import PermissionsList from './PermissionsList';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type EscalationPermission = Database['public']['Enums']['escalation_permission'];

interface RolePermission {
  role: UserRole;
  permission: EscalationPermission;
  is_allowed: boolean;
}

interface Role {
  id: string;
  name: UserRole;
  description: string;
  userCount: number;
}

interface Permission {
  id: string;
  name: EscalationPermission;
  description: string;
  category: string;
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

const PermissionsTab = () => {
  const { toast } = useToast();
  
  // Mock data for roles
  const [roles] = useState<Role[]>([
    { id: '1', name: 'owner', description: 'Full system access and control', userCount: 1 },
    { id: '2', name: 'admin', description: 'Administrative access with most permissions', userCount: 2 },
    { id: '3', name: 'manager', description: 'Supervisory access with operational permissions', userCount: 3 },
    { id: '4', name: 'staff', description: 'Standard operational access', userCount: 8 },
    { id: '5', name: 'vendor', description: 'External contractor access', userCount: 5 }
  ]);

  // Mock data for permissions
  const [permissions] = useState<Permission[]>([
    { id: '1', name: 'can_use_ladder', description: permissionDescriptions.can_use_ladder, category: 'Safety Equipment' },
    { id: '2', name: 'can_handle_electrical', description: permissionDescriptions.can_handle_electrical, category: 'Electrical Work' },
    { id: '3', name: 'can_disassemble_parts', description: permissionDescriptions.can_disassemble_parts, category: 'Mechanical Work' },
    { id: '4', name: 'can_work_at_height', description: permissionDescriptions.can_work_at_height, category: 'Safety Equipment' },
    { id: '5', name: 'can_handle_chemicals', description: permissionDescriptions.can_handle_chemicals, category: 'Hazardous Materials' },
    { id: '6', name: 'can_operate_heavy_equipment', description: permissionDescriptions.can_operate_heavy_equipment, category: 'Equipment Operation' },
    { id: '7', name: 'can_access_restricted_areas', description: permissionDescriptions.can_access_restricted_areas, category: 'Access Control' },
    { id: '8', name: 'can_perform_emergency_shutdowns', description: permissionDescriptions.can_perform_emergency_shutdowns, category: 'Emergency Procedures' }
  ]);

  // Role permissions data
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([
    // Owner permissions (all allowed)
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
    // Vendor permissions
    { role: 'vendor', permission: 'can_use_ladder', is_allowed: true },
    { role: 'vendor', permission: 'can_handle_electrical', is_allowed: true },
    { role: 'vendor', permission: 'can_disassemble_parts', is_allowed: true },
    { role: 'vendor', permission: 'can_work_at_height', is_allowed: false },
    { role: 'vendor', permission: 'can_handle_chemicals', is_allowed: false },
    { role: 'vendor', permission: 'can_operate_heavy_equipment', is_allowed: false },
    { role: 'vendor', permission: 'can_access_restricted_areas', is_allowed: false },
    { role: 'vendor', permission: 'can_perform_emergency_shutdowns', is_allowed: false }
  ]);

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('staff');

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions Management</CardTitle>
        <CardDescription>
          Manage roles, permissions, and role-permission assignments
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <Settings size={16} />
              Role Assignments
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Users size={16} />
              Manage Roles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield size={16} />
              Manage Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            <RolePermissionMatrix
              roles={roles}
              permissions={permissions}
              rolePermissions={rolePermissions}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              onPermissionToggle={handlePermissionToggle}
            />
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <RolesList
              roles={roles}
              isRoleDialogOpen={isRoleDialogOpen}
              onRoleDialogOpenChange={setIsRoleDialogOpen}
            />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <PermissionsList
              permissions={permissions}
              isPermissionDialogOpen={isPermissionDialogOpen}
              onPermissionDialogOpenChange={setIsPermissionDialogOpen}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PermissionsTab;
