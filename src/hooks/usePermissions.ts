
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];
type EscalationPermission = Database['public']['Enums']['escalation_permission'];

export interface UserPermission {
  permission: EscalationPermission;
  is_allowed: boolean;
  is_custom: boolean;
}

export interface RolePermission {
  id: string;
  role: UserRole;
  permission: EscalationPermission;
  is_allowed: boolean;
  created_at: string | null;
}

export const usePermissions = (userId?: string, userRole?: UserRole) => {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [roleDefaults, setRoleDefaults] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch role default permissions
  const fetchRoleDefaults = useCallback(async (role?: UserRole) => {
    if (!role) return;
    
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role', role);

      if (error) throw error;
      setRoleDefaults(data || []);
    } catch (err) {
      console.error('Error fetching role defaults:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  // Fetch user-specific permissions
  const fetchUserPermissions = useCallback(async (targetUserId: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.rpc('get_user_permissions', {
        target_user_id: targetUserId,
        user_role: role
      });

      if (error) throw error;
      setPermissions(data || []);
    } catch (err) {
      console.error('Error fetching user permissions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  // Initialize user permissions from role defaults
  const initializeUserPermissions = async (targetUserId: string, role: UserRole) => {
    try {
      const { error } = await supabase.rpc('initialize_user_permissions', {
        target_user_id: targetUserId,
        user_role: role
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error initializing user permissions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Update a specific permission for a user
  const updateUserPermission = async (
    targetUserId: string,
    role: UserRole,
    permission: EscalationPermission,
    isAllowed: boolean
  ) => {
    try {
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: targetUserId,
          role: role,
          permission: permission,
          is_allowed: isAllowed,
          custom_permissions_applied: true,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Refresh permissions after update
      if (userId && userRole) {
        await fetchUserPermissions(userId, userRole);
      }
    } catch (err) {
      console.error('Error updating user permission:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: EscalationPermission): boolean => {
    const userPerm = permissions.find(p => p.permission === permission);
    return userPerm?.is_allowed || false;
  };

  // Get permission status with custom flag
  const getPermissionStatus = (permission: EscalationPermission) => {
    return permissions.find(p => p.permission === permission) || {
      permission,
      is_allowed: false,
      is_custom: false
    };
  };

  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Always fetch role defaults if userRole is provided
        if (userRole) {
          await fetchRoleDefaults(userRole);
        }

        // If user ID is provided, also fetch user-specific permissions
        if (userId && userRole) {
          // First initialize user permissions if they don't exist
          await initializeUserPermissions(userId, userRole);
          // Then fetch user-specific permissions
          await fetchUserPermissions(userId, userRole);
        }
      } catch (err) {
        console.error('Error loading permissions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [userId, userRole, fetchRoleDefaults, fetchUserPermissions]);

  return {
    permissions,
    roleDefaults,
    loading,
    error,
    hasPermission,
    getPermissionStatus,
    updateUserPermission,
    fetchUserPermissions: () => userId && userRole ? fetchUserPermissions(userId, userRole) : Promise.resolve(),
    fetchRoleDefaults: () => fetchRoleDefaults(userRole)
  };
};
