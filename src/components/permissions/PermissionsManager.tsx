import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/hooks/usePermissions';
import PermissionBadge from './PermissionBadge';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type EscalationPermission = Database['public']['Enums']['escalation_permission'];

interface PermissionsManagerProps {
  userId: string;
  userRole: UserRole;
  userName: string;
  isCurrentUser?: boolean;
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
  vendor: 'bg-gray-100 text-gray-800 border-gray-200',
  franchisee: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  tech: 'bg-teal-100 text-teal-800 border-teal-200',
  employee: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const PermissionsManager: React.FC<PermissionsManagerProps> = ({
  userId,
  userRole,
  userName,
  isCurrentUser = false
}) => {
  const { toast } = useToast();
  const {
    permissions,
    roleDefaults,
    loading,
    error,
    getPermissionStatus,
    updateUserPermission,
    fetchUserPermissions
  } = usePermissions(userId, userRole);

  const [updatingPermission, setUpdatingPermission] = useState<string | null>(null);

  const handlePermissionToggle = async (permission: EscalationPermission, newValue: boolean) => {
    setUpdatingPermission(permission);
    
    try {
      await updateUserPermission(userId, userRole, permission, newValue);
      toast({
        title: "Permission Updated",
        description: `${permission.replace('can_', '').replace('_', ' ')} permission has been ${newValue ? 'granted' : 'revoked'}.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update permission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingPermission(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading permissions...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error loading permissions: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {userName} - Permissions
              <div className={`px-2 py-1 rounded text-xs font-medium border ${roleColors[userRole]}`}>
                {userRole.toUpperCase()}
              </div>
            </CardTitle>
            <CardDescription>
              Manage escalation permissions for safety-critical tasks
              {isCurrentUser && " (Your current permissions)"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {Object.entries(permissionDescriptions).map(([permission, description]) => {
            const permStatus = getPermissionStatus(permission as EscalationPermission);
            const roleDefault = roleDefaults.find(r => r.permission === permission);
            
            return (
              <div key={permission} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">
                      {permission.replace('can_', '').replace(/_/g, ' ').toUpperCase()}
                    </Label>
                    <PermissionBadge
                      permission={permission as EscalationPermission}
                      isAllowed={permStatus.is_allowed}
                      isCustom={permStatus.is_custom}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{description}</p>
                  {roleDefault && (
                    <p className="text-xs text-gray-500">
                      Role default: {roleDefault.is_allowed ? 'Allowed' : 'Restricted'}
                      {permStatus.is_custom && ' (Custom override applied)'}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={permStatus.is_allowed}
                    onCheckedChange={(checked) => 
                      handlePermissionToggle(permission as EscalationPermission, checked)
                    }
                    disabled={updatingPermission === permission || isCurrentUser}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {isCurrentUser && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              These are your current permissions. Contact an administrator to request changes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PermissionsManager;
