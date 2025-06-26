
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Shield, Users, Settings, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import RoleDialog from './RoleDialog';
import PermissionDialog from './PermissionDialog';
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

const roleColors: Record<UserRole, string> = {
  owner: 'bg-purple-100 text-purple-800 border-purple-200',
  admin: 'bg-blue-100 text-blue-800 border-blue-200',
  manager: 'bg-green-100 text-green-800 border-green-200',
  staff: 'bg-orange-100 text-orange-800 border-orange-200',
  vendor: 'bg-gray-100 text-gray-800 border-gray-200'
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

  // Filtering for permissions
  const {
    searchTerm: permissionSearchTerm,
    setSearchTerm: setPermissionSearchTerm,
    filters: permissionFilters,
    updateFilter: updatePermissionFilter,
    showFilters: showPermissionFilters,
    setShowFilters: setShowPermissionFilters,
    filteredData: filteredPermissions,
    clearAllFilters: clearPermissionFilters,
    hasActiveFilters: hasActivePermissionFilters
  } = useDataFiltering({
    data: permissions,
    searchFields: ['name', 'description'],
    filterConfigs: {
      category: 'all'
    }
  });

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

  const getUniqueCategories = () => {
    return Array.from(new Set(permissions.map(p => p.category)));
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Role Permission Assignments</h3>
                <p className="text-sm text-muted-foreground">Configure which permissions each role has</p>
              </div>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
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
                            handlePermissionToggle(selectedRole, permission.name, checked)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Manage Roles</h3>
                <p className="text-sm text-muted-foreground">Add, edit, and delete user roles</p>
              </div>
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

            <div className="grid gap-4">
              {roles.map((role) => (
                <Card key={role.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded text-sm font-medium border ${roleColors[role.name]}`}>
                          {role.name.toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium">{role.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {role.userCount} users assigned to this role
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Manage Permissions</h3>
                <p className="text-sm text-muted-foreground">Add, edit, and delete system permissions</p>
              </div>
              <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Add Permission
                  </Button>
                </DialogTrigger>
                <PermissionDialog onClose={() => setIsPermissionDialogOpen(false)} />
              </Dialog>
            </div>

            {/* Search and Filter Controls for Permissions */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={permissionSearchTerm}
                  onChange={(e) => setPermissionSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPermissionFilters(!showPermissionFilters)}
                className="gap-2"
              >
                <Filter size={16} />
                Filters
              </Button>
              {hasActivePermissionFilters && (
                <Button variant="ghost" onClick={clearPermissionFilters} className="text-sm">
                  Clear Filters
                </Button>
              )}
            </div>

            {showPermissionFilters && (
              <div className="flex gap-4 pt-4 border-t">
                <div className="flex-1 max-w-sm">
                  <Select value={permissionFilters.category} onValueChange={(value) => updatePermissionFilter('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getUniqueCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              {filteredPermissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {hasActivePermissionFilters ? 'No permissions match your search criteria' : 'No permissions found'}
                </div>
              ) : (
                filteredPermissions.map((permission) => (
                  <Card key={permission.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Shield size={20} className="text-blue-600" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {permission.name.replace('can_', '').replace(/_/g, ' ').toUpperCase()}
                              </h4>
                              <Badge variant="outline">
                                {permission.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit size={16} />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PermissionsTab;
