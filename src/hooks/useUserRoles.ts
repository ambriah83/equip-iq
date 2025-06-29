
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'owner' | 'manager' | 'franchisee' | 'tech' | 'employee';
  status: 'active' | 'inactive';
  assigned_by?: string;
  assigned_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'manager' | 'franchisee' | 'tech' | 'employee';
  status: 'active' | 'inactive';
}

export const useUserRoles = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsersWithRoles = async () => {
    try {
      setLoading(true);
      
      // Fetch user profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const userRole = roles?.find(role => role.user_id === profile.id);
        
        return {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'No Name',
          email: profile.email || '',
          role: (userRole?.role as UserWithRole['role']) || 'employee',
          status: (userRole?.status as UserWithRole['status']) || 'active'
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users with roles:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
      
      // Fallback to mock data for development
      setUsers([
        { id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', name: 'John Doe', email: 'john@company.com', role: 'admin', status: 'active' },
        { id: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: 'Jane Smith', email: 'jane@company.com', role: 'manager', status: 'active' },
        { id: '6ba7b812-9dad-11d1-80b4-00c04fd430c8', name: 'Bob Wilson', email: 'bob@company.com', role: 'franchisee', status: 'inactive' },
        { id: '6ba7b813-9dad-11d1-80b4-00c04fd430c8', name: 'Alice Johnson', email: 'alice@company.com', role: 'tech', status: 'active' },
        { id: '6ba7b814-9dad-11d1-80b4-00c04fd430c8', name: 'Mike Davis', email: 'mike@company.com', role: 'owner', status: 'active' },
        { id: '6ba7b815-9dad-11d1-80b4-00c04fd430c8', name: 'Sarah Brown', email: 'sarah@company.com', role: 'employee', status: 'active' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: UserWithRole['role'], status: UserWithRole['status']) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role,
          status,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role, status } : user
      ));

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchUsersWithRoles();
  }, []);

  return {
    users,
    loading,
    updateUserRole,
    refetch: fetchUsersWithRoles
  };
};
