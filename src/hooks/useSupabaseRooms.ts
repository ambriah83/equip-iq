
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Room = Database['public']['Tables']['rooms']['Row'];
type RoomInsert = Database['public']['Tables']['rooms']['Insert'];

export interface RoomWithLocation extends Room {
  locations?: { name: string; abbreviation: string; };
}

export const useSupabaseRooms = () => {
  const [rooms, setRooms] = useState<RoomWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          locations:location_id (name, abbreviation)
        `)
        .order('name');
      
      if (error) throw error;
      setRooms(data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (roomData: RoomInsert) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert(roomData)
        .select(`
          *,
          locations:location_id (name, abbreviation)
        `)
        .single();
      
      if (error) throw error;
      
      setRooms(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error creating room:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    createRoom,
    refetch: fetchRooms
  };
};
