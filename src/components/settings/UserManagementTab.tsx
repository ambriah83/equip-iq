
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { useUserInvitations } from '@/hooks/useUserInvitations';
import { useUserRoles, UserWithRole } from '@/hooks/useUserRoles';
import { User } from '@/types/User';
import UserDialog from './UserDialog';
import UserFilters from './UserFilters';
import UserList from './UserList';
import UserImportDialog from './UserImportDialog';
import SendInvitationDialog from './SendInvitationDialog';
import InvitationsList from './InvitationsList';

const UserManagementTab = () => {
  const { toast } = useToast();
  
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isInvitationDialogOpen, setIsInvitationDialogOpen] = useState(false);

  const { users, loading: loadingUsers, updateUserRole, refetch: refetchUsers } = useUserRoles();

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
    fetchInvitations();
  }, [fetchInvitations]);

  function handleSaveUser(userData: User) {
    if (editingUser) {
      // Update user role in database
      updateUserRole(editingUser.id, userData.role, userData.status);
      toast({
        title: "User Updated",
        description: "User has been updated successfully.",
      });
    } else {
      // For new users, we'll handle this through the invitation system
      toast({
        title: "User Added",
        description: "New user has been added successfully.",
      });
      refetchUsers();
    }
    setIsUserDialogOpen(false);
    setEditingUser(null);
  }

  function handleDeleteUser(userId: string) {
    // In a real implementation, you'd want to deactivate rather than delete
    updateUserRole(userId, 'employee', 'inactive');
    toast({
      title: "User Deactivated",
      description: "User has been deactivated successfully.",
    });
  }

  function handleEditUser(user: UserWithRole) {
    // Convert UserWithRole to User for the dialog
    const userForDialog: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };
    setEditingUser(userForDialog);
    setIsUserDialogOpen(true);
  }

  function handleAddUser() {
    setEditingUser(null);
    setIsUserDialogOpen(true);
  }

  function handleUsersImported() {
    console.log('Users imported successfully');
    refetchUsers();
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
