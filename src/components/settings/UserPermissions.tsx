import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type EscalationPermission = Database['public']['Enums']['escalation_permission'];

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'manager' | 'franchisee' | 'tech' | 'employee';
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

// Role permissions based on the migration data
const rolePermissions: Record<UserRole, Record<EscalationPermission, boolean>> = {
  owner: {
    can_use_ladder: true,
    can_handle_electrical: true,
    can_disassemble_parts: true,
    can_work_at_height: true,
    can_handle_chemicals: true,
    can_operate_heavy_equipment: true,
    can_access_restricted_areas: true,
    can_perform_emergency_shutdowns: true,
  },
  admin: {
    can_use_ladder: true,
    can_handle_electrical: true,
    can_disassemble_parts: true,
    can_work_at_height: true,
    can_handle_chemicals: true,
    can_operate_heavy_equipment: true,
    can_access_restricted_areas: true,
    can_perform_emergency_shutdowns: true,
  },
  manager: {
    can_use_ladder: true,
    can_handle_electrical: false,
    can_disassemble_parts: true,
    can_work_at_height: true,
    can_handle_chemicals: false,
    can_operate_heavy_equipment: false,
    can_access_restricted_areas: true,
    can_perform_emergency_shutdowns: true,
  },
  franchisee: {
    can_use_ladder: true,
    can_handle_electrical: true,
    can_disassemble_parts: true,
    can_work_at_height: true,
    can_handle_chemicals: false,
    can_operate_heavy_equipment: false,
    can_access_restricted_areas: true,
    can_perform_emergency_shutdowns: true,
  },
  tech: {
    can_use_ladder: true,
    can_handle_electrical: true,
    can_disassemble_parts: true,
    can_work_at_height: true,
    can_handle_chemicals: true,
    can_operate_heavy_equipment: true,
    can_access_restricted_areas: false,
    can_perform_emergency_shutdowns: false,
  },
  employee: {
    can_use_ladder: true,
    can_handle_electrical: false,
    can_disassemble_parts: true,
    can_work_at_height: false,
    can_handle_chemicals: false,
    can_operate_heavy_equipment: false,
    can_access_restricted_areas: false,
    can_perform_emergency_shutdowns: false,
  },
  // Keep legacy roles for compatibility
  staff: {
    can_use_ladder: true,
    can_handle_electrical: false,
    can_disassemble_parts: true,
    can_work_at_height: false,
    can_handle_chemicals: false,
    can_operate_heavy_equipment: false,
    can_access_restricted_areas: false,
    can_perform_emergency_shutdowns: false,
  },
  vendor: {
    can_use_ladder: true,
    can_handle_electrical: true,
    can_disassemble_parts: true,
    can_work_at_height: false,
    can_handle_chemicals: false,
    can_operate_heavy_equipment: false,
    can_access_restricted_areas: false,
    can_perform_emergency_shutdowns: false,
  }
};

const UserPermissions: React.FC<UserPermissionsProps> = ({
  user,
  userRole,
  onPermissionToggle
}) => {
  const getPermissionForRole = (permission: EscalationPermission) => {
    return rolePermissions[userRole]?.[permission] || false;
  };

  const formatPermissionName = (permission: string) => {
    return permission.replace('can_', '').replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">User Permissions</h3>
      <p className="text-sm text-gray-600">
        {user ? 'Customize permissions for this user. These override the default role permissions.' : 'Default permissions for the selected role.'}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
        {Object.entries(permissionDescriptions).map(([permission, description]) => {
          const isAllowed = getPermissionForRole(permission as EscalationPermission);
          
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
                <div className="text-xs text-green-600 mt-1">
                  Role default: {isAllowed ? 'Allowed' : 'Restricted'}
                </div>
              </div>
              <Switch
                checked={isAllowed}
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
