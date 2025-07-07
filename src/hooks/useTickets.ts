import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Ticket, TicketWithDetails, CreateTicketData, UpdateTicketData } from '@/types/Ticket';

type TicketRow = Database['public']['Tables']['tickets']['Row'];
type TicketInsert = Database['public']['Tables']['tickets']['Insert'];
type TicketUpdate = Database['public']['Tables']['tickets']['Update'];

export const useTickets = () => {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          locations:location_id (name),
          equipment:equipment_id (name),
          rooms:room_id (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to include display names
      const transformedData: TicketWithDetails[] = (data || []).map(item => ({
        id: item.id,
        location_id: item.location_id,
        equipment_id: item.equipment_id,
        room_id: item.room_id,
        ticket_type: item.ticket_type as 'maintenance' | 'vendor' | 'inspection' | 'other',
        status: item.status as 'open' | 'in_progress' | 'on_hold' | 'closed' | 'cancelled',
        priority: item.priority as 'low' | 'medium' | 'high' | 'urgent',
        title: item.title,
        description: item.description,
        reported_by_user_id: item.reported_by_user_id,
        assigned_to_user_id: item.assigned_to_user_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        resolved_at: item.resolved_at,
        location_name: item.locations?.name || 'Unknown',
        equipment_name: item.equipment?.name || undefined,
        room_name: item.rooms?.name || undefined
      }));
      
      setTickets(transformedData);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: CreateTicketData) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const insertData: TicketInsert = {
        ...ticketData,
        reported_by_user_id: user.user.id
      };

      const { data, error } = await supabase
        .from('tickets')
        .insert(insertData)
        .select(`
          *,
          locations:location_id (name),
          equipment:equipment_id (name),
          rooms:room_id (name)
        `)
        .single();
      
      if (error) throw error;
      
      const transformedData: TicketWithDetails = {
        id: data.id,
        location_id: data.location_id,
        equipment_id: data.equipment_id,
        room_id: data.room_id,
        ticket_type: data.ticket_type as 'maintenance' | 'vendor' | 'inspection' | 'other',
        status: data.status as 'open' | 'in_progress' | 'on_hold' | 'closed' | 'cancelled',
        priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
        title: data.title,
        description: data.description,
        reported_by_user_id: data.reported_by_user_id,
        assigned_to_user_id: data.assigned_to_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        resolved_at: data.resolved_at,
        location_name: data.locations?.name || 'Unknown',
        equipment_name: data.equipment?.name || undefined,
        room_name: data.rooms?.name || undefined
      };
      
      setTickets(prev => [transformedData, ...prev]);
      return transformedData;
    } catch (err) {
      console.error('Error creating ticket:', err);
      throw err;
    }
  };

  const updateTicket = async (id: string, ticketData: UpdateTicketData) => {
    try {
      const updateData: TicketUpdate = {
        ...ticketData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          locations:location_id (name),
          equipment:equipment_id (name),
          rooms:room_id (name)
        `)
        .single();
      
      if (error) throw error;
      
      const transformedData: TicketWithDetails = {
        id: data.id,
        location_id: data.location_id,
        equipment_id: data.equipment_id,
        room_id: data.room_id,
        ticket_type: data.ticket_type as 'maintenance' | 'vendor' | 'inspection' | 'other',
        status: data.status as 'open' | 'in_progress' | 'on_hold' | 'closed' | 'cancelled',
        priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
        title: data.title,
        description: data.description,
        reported_by_user_id: data.reported_by_user_id,
        assigned_to_user_id: data.assigned_to_user_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        resolved_at: data.resolved_at,
        location_name: data.locations?.name || 'Unknown',
        equipment_name: data.equipment?.name || undefined,
        room_name: data.rooms?.name || undefined
      };
      
      setTickets(prev => prev.map(ticket => ticket.id === id ? transformedData : ticket));
      return transformedData;
    } catch (err) {
      console.error('Error updating ticket:', err);
      throw err;
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTickets(prev => prev.filter(ticket => ticket.id !== id));
    } catch (err) {
      console.error('Error deleting ticket:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    createTicket,
    updateTicket,
    deleteTicket,
    refetch: fetchTickets
  };
};