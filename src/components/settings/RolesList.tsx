import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import RoleDialog from './RoleDialog';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface Role {
  id: string;
  name: UserRole;
  description: string;
  userCount: number;
}

interface RolesListProps {
  roles: Role[];
  isRoleDialogOpen: boolean;
  onRoleDialogOpenChange: (open: boolean) => void;
}

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

const RolesList: React.FC<RolesListProps> = ({
  roles,
  isRoleDialogOpen,
  onRoleDialogOpenChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Manage Roles</h3>
          <p className="text-sm text-muted-foreground">Add, edit, and delete user roles</p>
        </div>
        <Dialog open={isRoleDialogOpen} onOpenChange={onRoleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <RoleDialog onClose={() => onRoleDialogOpenChange(false)} />
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
    </div>
  );
};

export default RolesList;
