import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import UserDialog from './UserDialog';
import UserFilters from './UserFilters';
import UserList from './UserList';
import UserImportDialog from './UserImportDialog';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'manager' | 'staff';
  status: 'active' | 'inactive';
}

const UserManagementTab = () => {
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([
    { id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: 'John Doe', email: 'john@company.com', role: 'admin', status: 'active' },
    { id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: 'Jane Smith', email: 'jane@company.com', role: 'manager', status: 'active' },
    { id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8', name: 'Bob Wilson', email: 'bob@company.com', role: 'staff', status: 'inactive' },
    { id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8', name: 'Alice Johnson', email: 'alice@company.com', role: 'staff', status: 'active' },
    { id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8', name: 'Mike Davis', email: 'mike@company.com', role: 'owner', status: 'active' },
  ]);

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    showFilters,
    setShowFilters,
    filteredData,
    clearAllFilters,
    hasActiveFilters
  } = useDataFiltering({
    data: users,
    searchFields: ['name', 'email'],
    filterConfigs: {
      role: 'all',
      status: 'active'
    }
  });

  function handleSaveUser(userData: Partial<User>) {
    if (editingUser) {
      setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...userData } : user));
      toast({
        title: "User Updated",
        description: "User has been updated successfully.",
      });
    } else {
      const newUser: User = {
        id: crypto.randomUUID(),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'staff',
        status: userData.status || 'active'
      };
      setUsers([...users, newUser]);
      toast({
        title: "User Added",
        description: "New user has been added successfully.",
      });
    }
    setIsUserDialogOpen(false);
    setEditingUser(null);
  }

  function handleDeleteUser(userId: string) {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Removed",
      description: "User has been removed successfully.",
    });
  }

  function handleEditUser(user: User) {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  }

  function handleAddUser() {
    setEditingUser(null);
    setIsUserDialogOpen(true);
  }

  function handleUsersImported() {
    console.log('Users imported successfully');
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Add, edit, and manage user accounts</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload size={16} className="mr-2" />
              Import Users
            </Button>
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddUser}>
                  <Plus size={16} className="mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <UserDialog
                user={editingUser}
                onSave={handleSaveUser}
                onClose={() => setIsUserDialogOpen(false)}
              />
            </Dialog>
          </div>
        </div>
        
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={filters.role}
          onRoleFilterChange={(value) => updateFilter('role', value)}
          statusFilter={filters.status}
          onStatusFilterChange={(value) => updateFilter('status', value)}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
        />
      </CardHeader>
      
      <CardContent>
        <UserList
          users={filteredData}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          hasActiveFilters={hasActiveFilters}
        />
      </CardContent>

      <UserImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onUsersImported={handleUsersImported}
      />
    </Card>
  );
};

export default UserManagementTab;
