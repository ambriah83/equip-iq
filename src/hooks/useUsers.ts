import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { User, UserWithProfile, UpdateUserData } from '@/types/User';

type UserRow = Database['public']['Tables']['users']['Row'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export const useUsers = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: usersData, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get user profiles separately
      const userIds = usersData?.map(user => user.id) || [];
      const { data: profilesData } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, company, position')
        .in('id', userIds);
      
      // Transform the data to include profile information
      const transformedData: UserWithProfile[] = (usersData || []).map(item => {
        const profile = profilesData?.find(p => p.id === item.id);
        return {
          id: item.id,
          email: item.email,
          phone: item.phone,
          is_active: item.is_active,
          created_at: item.created_at,
          updated_at: item.updated_at,
          first_name: profile?.first_name || undefined,
          last_name: profile?.last_name || undefined,
          company: profile?.company || undefined,
          position: profile?.position || undefined,
          full_name: profile 
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
            : undefined
        };
      });
      
      setUsers(transformedData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: UpdateUserData) => {
    try {
      const updateData: UserUpdate = {
        ...userData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Get updated profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, company, position')
        .eq('id', id)
        .single();
      
      const transformedData: UserWithProfile = {
        id: data.id,
        email: data.email,
        phone: data.phone,
        is_active: data.is_active,
        created_at: data.created_at,
        updated_at: data.updated_at,
        first_name: profileData?.first_name || undefined,
        last_name: profileData?.last_name || undefined,
        company: profileData?.company || undefined,
        position: profileData?.position || undefined,
        full_name: profileData 
          ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim()
          : undefined
      };
      
      setUsers(prev => prev.map(user => user.id === id ? transformedData : user));
      return transformedData;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const deactivateUser = async (id: string) => {
    return updateUser(id, { is_active: false });
  };

  const activateUser = async (id: string) => {
    return updateUser(id, { is_active: true });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    updateUser,
    deactivateUser,
    activateUser,
    refetch: fetchUsers
  };
};