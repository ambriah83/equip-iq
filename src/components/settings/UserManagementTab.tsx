import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { useUserInvitations } from '@/hooks/useUserInvitations';
import { User } from '@/types/User';
import UserDialog from './UserDialog';
import UserFilters from './UserFilters';
import UserList from './UserList';
import UserImportDialog from './UserImportDialog';
import SendInvitationDialog from './SendInvitationDialog';
import InvitationsList from './InvitationsList';
import { supabase } from '@/integrations/supabase/client';

const UserManagementTab = () => {
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const {
    invitations,
    loading: invitationsLoading,
    fetchInvitations,
    cancelInvitation,
    resendInvitation
  } = useUserInvitations();

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

  useEffect(() => {
    fetchUsers();
    fetchInvitations();
  }, [fetchInvitations]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers: User[] = (data || []).map(profile => ({
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'No Name',
        email: profile.email,
        role: profile.role as 'admin' | 'owner' | 'manager' | 'franchisee' | 'tech' | 'employee',
        status: profile.status as 'active' | 'inactive'
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Keep mock data for now if database fetch fails
      setUsers([
        { id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: 'John Doe', email: 'john@company.com', role: 'admin', status: 'active' },
        { id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: 'Jane Smith', email: 'jane@company.com', role: 'manager', status: 'active' },
        { id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8', name: 'Bob Wilson', email: 'bob@company.com', role: 'franchisee', status: 'inactive' },
        { id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8', name: 'Alice Johnson', email: 'alice@company.com', role: 'tech', status: 'active' },
        { id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8', name: 'Mike Davis', email: 'mike@company.com', role: 'owner', status: 'active' },
        { id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8', name: 'Sarah Brown', email: 'sarah@company.com', role: 'employee', status: 'active' },
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

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
        role: userData.role || 'employee',
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
    fetchUsers();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Add, edit, and manage user accounts</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isInvitationDialogOpen} onOpenChange={setIsInvitationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <UserPlus size={16} className="mr-2" />
                    Invite User
                  </Button>
                </DialogTrigger>
                <SendInvitationDialog onClose={() => setIsInvitationDialogOpen(false)} />
              </Dialog>
              
              <Button 
                variant="outline" 
                onClick={() => setIsImportDialogOpen(true)}
              >
                <Upload size={16} className="mr-2" />
                Import Users
              </Button>
              
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleAddUser}>
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

      <InvitationsList
        invitations={invitations}
        onCancel={cancelInvitation}
        onResend={resendInvitation}
        loading={invitationsLoading}
      />
    </div>
  );
};

export default UserManagementTab;
