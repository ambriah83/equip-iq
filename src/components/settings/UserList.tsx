
import React from 'react';
import { LegacyUser as User } from '@/types/User';
import { UserWithRole } from '@/hooks/useUserRoles';
import UserCard from './UserCard';

interface UserListProps {
  users: UserWithRole[];
  onEditUser: (user: UserWithRole) => void;
  onDeleteUser: (userId: string) => void;
  hasActiveFilters: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, onEditUser, onDeleteUser, hasActiveFilters }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {hasActiveFilters ? 'No users match your current filters.' : 'No users found.'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => {
        // Convert UserWithRole to User for the UserCard component
        const userForCard: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        };
        
        return (
          <UserCard
            key={user.id}
            user={userForCard}
            onEdit={() => onEditUser(user)}
            onDelete={onDeleteUser}
          />
        );
      })}
    </div>
  );
};

export default UserList;
