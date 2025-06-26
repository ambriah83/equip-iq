
import React, { createContext, useContext, ReactNode } from 'react';
import { usePermissions, UserPermission } from '@/hooks/usePermissions';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type EscalationPermission = Database['public']['Enums']['escalation_permission'];

interface PermissionsContextType {
  permissions: UserPermission[];
  loading: boolean;
  error: string | null;
  hasPermission: (permission: EscalationPermission) => boolean;
  getPermissionStatus: (permission: EscalationPermission) => UserPermission;
  updateUserPermission: (
    targetUserId: string,
    role: UserRole,
    permission: EscalationPermission,
    isAllowed: boolean
  ) => Promise<void>;
  fetchUserPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

interface PermissionsProviderProps {
  children: ReactNode;
  userId?: string;
  userRole?: UserRole;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  children,
  userId,
  userRole
}) => {
  const permissionsData = usePermissions(userId, userRole);

  return (
    <PermissionsContext.Provider value={permissionsData}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissionsContext = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider');
  }
  return context;
};
