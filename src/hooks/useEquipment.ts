
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Equipment = Database['public']['Tables']['equipment']['Row'];
type EquipmentInsert = Database['public']['Tables']['equipment']['Insert'];
type EquipmentUpdate = Database['public']['Tables']['equipment']['Update'];

export interface EquipmentWithDetails extends Equipment {
  locations?: { name: string; abbreviation: string; };
  equipment_types?: { name: string; };
  rooms?: { name: string; };
  // Add missing properties for compatibility
  type?: string;
  location?: string;
  room?: string;
  serialNumber?: string;
  warrantyStatus?: string;
  lastServiceDate?: string;
}

export const useEquipment = () => {
  const [equipment, setEquipment] = useState<EquipmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipment')
        .select(`
          *,
          locations (name, abbreviation),
          equipment_types (name),
          rooms (name)
        `)
        .order('name');
      
      if (error) throw error;
      
      // Transform the data to include compatibility properties
      const transformedData = (data || []).map(item => ({
        ...item,
        type: item.equipment_types?.name,
        location: item.locations?.name,
        room: item.rooms?.name,
        serialNumber: item.serial_number,
        warrantyStatus: item.warranty_status,
        lastServiceDate: item.last_service_date
      }));
      
      setEquipment(transformedData);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  };

  const createEquipment = async (equipmentData: EquipmentInsert) => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .insert(equipmentData)
        .select(`
          *,
          locations (name, abbreviation),
          equipment_types (name),
          rooms (name)
        `)
        .single();
      
      if (error) throw error;
      
      const transformedData = {
        ...data,
        type: data.equipment_types?.name,
        location: data.locations?.name,
        room: data.rooms?.name,
        serialNumber: data.serial_number,
        warrantyStatus: data.warranty_status,
        lastServiceDate: data.last_service_date
      };
      
      setEquipment(prev => [...prev, transformedData]);
      return transformedData;
    } catch (err) {
      console.error('Error creating equipment:', err);
      throw err;
    }
  };

  const updateEquipment = async (id: string, equipmentData: EquipmentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .update(equipmentData)
        .eq('id', id)
        .select(`
          *,
          locations (name, abbreviation),
          equipment_types (name),
          rooms (name)
        `)
        .single();
      
      if (error) throw error;
      
      const transformedData = {
        ...data,
        type: data.equipment_types?.name,
        location: data.locations?.name,
        room: data.rooms?.name,
        serialNumber: data.serial_number,
        warrantyStatus: data.warranty_status,
        lastServiceDate: data.last_service_date
      };
      
      setEquipment(prev => prev.map(eq => eq.id === id ? transformedData : eq));
      return transformedData;
    } catch (err) {
      console.error('Error updating equipment:', err);
      throw err;
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setEquipment(prev => prev.filter(eq => eq.id !== id));
    } catch (err) {
      console.error('Error deleting equipment:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  return {
    equipment,
    loading,
    error,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    refetch: fetchEquipment
  };
};
