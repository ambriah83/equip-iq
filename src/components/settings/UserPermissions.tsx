
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/usePermissions';
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

interface UserPermissionsProps {
  user: User | null;
  userRole: UserRole;
  onPermissionToggle: (permission: EscalationPermission, newValue: boolean) => void;
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

const permissionCategories: Record<EscalationPermission, string> = {
  can_use_ladder: 'Safety Equipment',
  can_handle_electrical: 'Electrical Work',
  can_disassemble_parts: 'Mechanical Work',
  can_work_at_height: 'Safety Equipment',
  can_handle_chemicals: 'Hazardous Materials',
  can_operate_heavy_equipment: 'Equipment Operation',
  can_access_restricted_areas: 'Access Control',
  can_perform_emergency_shutdowns: 'Emergency Procedures'
};

const UserPermissions: React.FC<UserPermissionsProps> = ({
  user,
  userRole,
  onPermissionToggle
}) => {
  const {
    permissions,
    roleDefaults,
    loading,
    getPermissionStatus
  } = usePermissions(user?.id, userRole);

  const getEffectivePermissionStatus = (permission: EscalationPermission) => {
    if (user) {
      return getPermissionStatus(permission);
    } else {
      const roleDefault = roleDefaults.find(rd => rd.permission === permission);
      return {
        permission,
        is_allowed: roleDefault?.is_allowed || false,
        is_custom: false
      };
    }
  };

  const formatPermissionName = (permission: string) => {
    return permission.replace('can_', '').replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">User Permissions</h3>
      <p className="text-sm text-gray-600">
        Customize permissions for this user. These override the default role permissions.
        {!user && ' (Showing default permissions for selected role)'}
      </p>
      
      {loading && user ? (
        <div className="text-center py-4">Loading permissions...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
          {Object.entries(permissionDescriptions).map(([permission, description]) => {
            const permStatus = getEffectivePermissionStatus(permission as EscalationPermission);
            
            return (
              <div key={permission} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium text-sm">
                      {formatPermissionName(permission)}
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {permissionCategories[permission as EscalationPermission]}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{description}</p>
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
                      onPermissionToggle(permission as EscalationPermission, checked);
                    }
                  }}
                  disabled={!user}
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
  );
};

export default UserPermissions;
