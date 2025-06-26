
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Location = Database['public']['Tables']['locations']['Row'];
type LocationInsert = Database['public']['Tables']['locations']['Insert'];
type LocationUpdate = Database['public']['Tables']['locations']['Update'];

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setLocations(data || []);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (locationData: LocationInsert) => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert(locationData)
        .select()
        .single();
      
      if (error) throw error;
      
      setLocations(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating location:', err);
      throw err;
    }
  };

  const updateLocation = async (id: string, locationData: LocationUpdate) => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .update(locationData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setLocations(prev => prev.map(loc => loc.id === id ? data : loc));
      return data;
    } catch (err) {
      console.error('Error updating location:', err);
      throw err;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setLocations(prev => prev.filter(loc => loc.id !== id));
    } catch (err) {
      console.error('Error deleting location:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    locations,
    loading,
    error,
    createLocation,
    updateLocation,
    deleteLocation,
    refetch: fetchLocations
  };
};
