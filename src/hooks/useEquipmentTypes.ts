
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type EquipmentType = Database['public']['Tables']['equipment_types']['Row'];

export const useEquipmentTypes = () => {
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipmentTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipment_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setEquipmentTypes(data || []);
    } catch (err) {
      console.error('Error fetching equipment types:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch equipment types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipmentTypes();
  }, []);

  return {
    equipmentTypes,
    loading,
    error,
    refetch: fetchEquipmentTypes
  };
};
