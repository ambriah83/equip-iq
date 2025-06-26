
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Shield, Search, Filter } from 'lucide-react';
import PermissionDialog from './PermissionDialog';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { Database } from '@/integrations/supabase/types';

type EscalationPermission = Database['public']['Enums']['escalation_permission'];

interface Permission {
  id: string;
  name: EscalationPermission;
  description: string;
  category: string;
}

interface PermissionsListProps {
  permissions: Permission[];
  isPermissionDialogOpen: boolean;
  onPermissionDialogOpenChange: (open: boolean) => void;
}

const PermissionsList: React.FC<PermissionsListProps> = ({
  permissions,
  isPermissionDialogOpen,
  onPermissionDialogOpenChange
}) => {
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

  const getUniqueCategories = () => {
    return Array.from(new Set(permissions.map(p => p.category)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Manage Permissions</h3>
          <p className="text-sm text-muted-foreground">Add, edit, and delete system permissions</p>
        </div>
        <Dialog open={isPermissionDialogOpen} onOpenChange={onPermissionDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Permission
            </Button>
          </DialogTrigger>
          <PermissionDialog onClose={() => onPermissionDialogOpenChange(false)} />
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
    </div>
  );
};

export default PermissionsList;
