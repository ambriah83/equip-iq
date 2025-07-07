import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyManagement, PropertyManagementWithLocation, CreatePropertyManagementData, UpdatePropertyManagementData } from '@/types/PropertyManagement';

export const usePropertyManagement = () => {
  const [propertyRecords, setPropertyRecords] = useState<PropertyManagementWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropertyManagement = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('property_management')
        .select('*, locations:location_id (name, abbreviation)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const transformedData: PropertyManagementWithLocation[] = (data || []).map(item => ({
        ...item,
        location_name: item.locations?.name || 'Unknown',
        location_abbreviation: item.locations?.abbreviation || ''
      }));
      
      setPropertyRecords(transformedData);
    } catch (err) {
      console.error('Error fetching property management:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch property management');
    } finally {
      setLoading(false);
    }
  };

  const createPropertyManagement = async (data: CreatePropertyManagementData) => {
    try {
      const { data: newRecord, error } = await supabase
        .from('property_management')
        .insert(data)
        .select('*, locations:location_id (name, abbreviation)')
        .single();
      
      if (error) throw error;
      
      const transformedRecord: PropertyManagementWithLocation = {
        ...newRecord,
        location_name: newRecord.locations?.name || 'Unknown',
        location_abbreviation: newRecord.locations?.abbreviation || ''
      };
      
      setPropertyRecords(prev => [transformedRecord, ...prev]);
      return transformedRecord;
    } catch (err) {
      console.error('Error creating property management:', err);
      throw err;
    }
  };

  const updatePropertyManagement = async (id: string, data: UpdatePropertyManagementData) => {
    try {
      const { data: updatedRecord, error } = await supabase
        .from('property_management')
        .update(data)
        .eq('id', id)
        .select('*, locations:location_id (name, abbreviation)')
        .single();
      
      if (error) throw error;
      
      const transformedRecord: PropertyManagementWithLocation = {
        ...updatedRecord,
        location_name: updatedRecord.locations?.name || 'Unknown',
        location_abbreviation: updatedRecord.locations?.abbreviation || ''
      };
      
      setPropertyRecords(prev => prev.map(record => record.id === id ? transformedRecord : record));
      return transformedRecord;
    } catch (err) {
      console.error('Error updating property management:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPropertyManagement();
  }, []);

  return {
    propertyRecords,
    loading,
    error,
    createPropertyManagement,
    updatePropertyManagement,
    refetch: fetchPropertyManagement
  };
};