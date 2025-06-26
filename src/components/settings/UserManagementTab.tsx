
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  ]);

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleSaveUser = (userData: Partial<User>) => {
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
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Removed",
      description: "User has been removed successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Add, edit, and manage user accounts</CardDescription>
          </div>
          <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingUser(null)}>
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
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
                  onClick={() => {
                    setEditingUser(user);
                    setIsUserDialogOpen(true);
                  }}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementTab;
