
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
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

interface RolePermissionMatrixProps {
  roles: Role[];
  permissions: Permission[];
  rolePermissions: RolePermission[];
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onPermissionToggle: (role: UserRole, permission: EscalationPermission, newValue: boolean) => void;
}

const roleColors: Record<UserRole, string> = {
  owner: 'bg-purple-100 text-purple-800 border-purple-200',
  admin: 'bg-blue-100 text-blue-800 border-blue-200',
  manager: 'bg-green-100 text-green-800 border-green-200',
  staff: 'bg-orange-100 text-orange-800 border-orange-200',
  vendor: 'bg-gray-100 text-gray-800 border-gray-200'
};

const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({
  roles,
  permissions,
  rolePermissions,
  selectedRole,
  onRoleChange,
  onPermissionToggle
}) => {
  const getPermissionForRole = (role: UserRole, permission: EscalationPermission) => {
    const rolePermission = rolePermissions.find(rp => rp.role === role && rp.permission === permission);
    return rolePermission?.is_allowed || false;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Role Permission Assignments</h3>
          <p className="text-sm text-muted-foreground">Configure which permissions each role has</p>
        </div>
        <Select value={selectedRole} onValueChange={(value) => onRoleChange(value as UserRole)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.name}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${roleColors[role.name].split(' ')[0]}`} />
                  {role.name.toUpperCase()}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded text-sm font-medium border ${roleColors[selectedRole]}`}>
              {selectedRole.toUpperCase()}
            </div>
            <div>
              <h4 className="font-medium">Role Permissions</h4>
              <p className="text-sm text-muted-foreground">
                {roles.find(r => r.name === selectedRole)?.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {permissions.map((permission) => {
              const isAllowed = getPermissionForRole(selectedRole, permission.name);
              
              return (
                <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label className="font-medium text-sm">
                        {permission.name.replace('can_', '').replace(/_/g, ' ').toUpperCase()}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {permission.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {permission.description}
                    </p>
                  </div>
                  <Switch
                    checked={isAllowed}
                    onCheckedChange={(checked) => 
                      onPermissionToggle(selectedRole, permission.name, checked)
                    }
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePermissionMatrix;
