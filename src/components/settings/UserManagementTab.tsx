import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus, User, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import UserDialog from './UserDialog';

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
    { id: '1', name: 'John Doe', email: 'john@company.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'manager', status: 'active' },
    { id: '3', name: 'Bob Wilson', email: 'bob@company.com', role: 'staff', status: 'inactive' },
    { id: '4', name: 'Alice Johnson', email: 'alice@company.com', role: 'staff', status: 'active' },
    { id: '5', name: 'Mike Davis', email: 'mike@company.com', role: 'owner', status: 'active' },
  ]);

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

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
      status: 'active' // Default to active users
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
        id: Date.now().toString(),
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Add, edit, and manage user accounts</CardDescription>
          </div>
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
        
        {/* Search and Filter Controls */}
        <div className="flex gap-4 items-center pt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter size={16} />
            Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearAllFilters} className="text-sm">
              Clear Filters
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="flex gap-4 pt-4 border-t">
            <div className="flex-1">
              <Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {hasActiveFilters ? 'No users match your search criteria' : 'No users found'}
            </div>
          ) : (
            filteredData.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={user.role === 'admin' ? 'default' : user.role === 'manager' ? 'secondary' : 'outline'}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementTab;
