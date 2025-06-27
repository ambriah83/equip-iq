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

// Updated role permissions to include new roles
const mockRolePermissions: Record<UserRole, Record<EscalationPermission, boolean>> = {
  owner: {
    can_use_ladder: true,
    can_handle_electrical: true,
    can_disassemble_parts: true,
    can_work_at_height: true,
    can_handle_chemicals: true,
    can_operate_heavy_equipment: true,
    can_access_restricted_areas: true,
    can_perform_emergency_shutdowns: true,
  },
  admin: {
    can_use_ladder: true,
    can_handle_electrical: true,
    can_disassemble_parts: true,
    can_work_at_height: true,
    can_handle_chemicals: true,
    can_operate_heavy_equipment: true,
    can_access_restricted_areas: true,
    can_perform_emergency_shutdowns: true,
  },
  manager: {
    can_use_ladder: true,
    can_handle_electrical: false,
    can_disassemble_parts: true,
    can_work_at_height: true,
    can_handle_chemicals: false,
    can_operate_heavy_equipment: false,
    can_access_restricted_areas: true,
    can_perform_emergency_shutdowns: true,
  },
  franchisee: {
    can_use_ladder: true,
    can_handle_electrical: true,
    can_disassemble_parts: true,
    can_work_at_height: true,
    can_handle_chemicals: false,
    can_operate_heavy_equipment: false,
    can_access_restricted_areas: true,
    can_perform_emergency_shutdowns: true,
  },
  tech: {
    can_use_ladder: true,
    can_handle_electrical: true,
    can_disassemble_parts: true,
    can_work_at_height: true,
    can_handle_chemicals: true,
    can_operate_heavy_equipment: true,
    can_access_restricted_areas: false,
    can_perform_emergency_shutdowns: false,
  },
  employee: {
    can_use_ladder: true,
    can_handle_electrical: false,
    can_disassemble_parts: true,
    can_work_at_height: false,
    can_handle_chemicals: false,
    can_operate_heavy_equipment: false,
    can_access_restricted_areas: false,
    can_perform_emergency_shutdowns: false,
  },
  // Keep legacy roles for compatibility
  staff: {
    can_use_ladder: true,
    can_handle_electrical: false,
    can_disassemble_parts: true,
    can_work_at_height: false,
    can_handle_chemicals: false,
    can_operate_heavy_equipment: false,
    can_access_restricted_areas: false,
    can_perform_emergency_shutdowns: false,
  },
  vendor: {
    can_use_ladder: true,
    can_handle_electrical: true,
    can_disassemble_parts: true,
    can_work_at_height: false,
    can_handle_chemicals: false,
    can_operate_heavy_equipment: false,
    can_access_restricted_areas: false,
    can_perform_emergency_shutdowns: false,
  }
};

export const usePermissions = (userId?: string, userRole?: UserRole) => {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [roleDefaults, setRoleDefaults] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch role default permissions
  const fetchRoleDefaults = useCallback(async (role?: UserRole) => {
    if (!role) return;
    
    try {
      // First try to fetch from Supabase
      const { data, error: supabaseError } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role', role);

      if (supabaseError) {
        console.log('Using mock data for role permissions:', supabaseError.message);
        // Fall back to mock data
        const mockData: RolePermission[] = Object.entries(mockRolePermissions[role]).map(([permission, is_allowed]) => ({
          id: `mock-${role}-${permission}`,
          role,
          permission: permission as EscalationPermission,
          is_allowed,
          created_at: new Date().toISOString()
        }));
        setRoleDefaults(mockData);
      } else {
        setRoleDefaults(data || []);
      }
    } catch (err) {
      console.error('Error fetching role defaults:', err);
      // Fall back to mock data
      const mockData: RolePermission[] = Object.entries(mockRolePermissions[role]).map(([permission, is_allowed]) => ({
        id: `mock-${role}-${permission}`,
        role,
        permission: permission as EscalationPermission,
        is_allowed,
        created_at: new Date().toISOString()
      }));
      setRoleDefaults(mockData);
    }
  }, []);

  // Fetch user-specific permissions
  const fetchUserPermissions = useCallback(async (targetUserId: string, role: UserRole) => {
    try {
      // For mock users (UUIDs starting with 550e8400), use role defaults
      if (targetUserId.startsWith('550e8400')) {
        console.log('Using mock data for user permissions');
        const mockPermissions: UserPermission[] = Object.entries(mockRolePermissions[role]).map(([permission, is_allowed]) => ({
          permission: permission as EscalationPermission,
          is_allowed,
          is_custom: false
        }));
        setPermissions(mockPermissions);
        return;
      }

      const { data, error } = await supabase.rpc('get_user_permissions', {
        target_user_id: targetUserId,
        user_role: role
      });

      if (error) {
        console.error('Supabase RPC error:', error);
        // Fall back to role defaults for real users too
        const mockPermissions: UserPermission[] = Object.entries(mockRolePermissions[role]).map(([permission, is_allowed]) => ({
          permission: permission as EscalationPermission,
          is_allowed,
          is_custom: false
        }));
        setPermissions(mockPermissions);
      } else {
        setPermissions(data || []);
      }
    } catch (err) {
      console.error('Error fetching user permissions:', err);
      // Fall back to role defaults
      const mockPermissions: UserPermission[] = Object.entries(mockRolePermissions[role]).map(([permission, is_allowed]) => ({
        permission: permission as EscalationPermission,
        is_allowed,
        is_custom: false
      }));
      setPermissions(mockPermissions);
    }
  }, []);

  // Initialize user permissions from role defaults
  const initializeUserPermissions = async (targetUserId: string, role: UserRole) => {
    // Skip initialization for mock users
    if (targetUserId.startsWith('550e8400')) {
      return;
    }

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
    // Skip updates for mock users
    if (targetUserId.startsWith('550e8400')) {
      console.log('Mock user permission update - would update in real system');
      return;
    }

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
      is_allowed: mockRolePermissions[userRole || 'staff']?.[permission] || false,
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
          // First initialize user permissions if they don't exist (skip for mock users)
          if (!userId.startsWith('550e8400')) {
            await initializeUserPermissions(userId, userRole);
          }
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
