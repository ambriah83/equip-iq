
import React from 'react';
import { User } from '@/types/User';
import UserCard from './UserCard';

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  hasActiveFilters: boolean;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onEditUser,
  onDeleteUser,
  hasActiveFilters
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {hasActiveFilters ? 'No users match your search criteria' : 'No users found'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
        />
      ))}
    </div>
  );
};

export default UserList;
