import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TicketWithDetails, CreateTicketData, UpdateTicketData, TicketFilters } from '@/types/Ticket';
import { useToast } from '@/hooks/use-toast';

export const useTickets = () => {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTickets = async (filters?: TicketFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('tickets')
        .select(`
          *,
          equipment:equipment_id (
            id,
            name
          ),
          location:location_id (
            id,
            name,
            abbreviation
          ),
          room:room_id (
            id,
            name
          ),
          assigned_to:assigned_to_user_id (
            id,
            email
          ),
          reported_by:reported_by_user_id (
            id,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.location_id && filters.location_id !== 'all') {
        query = query.eq('location_id', filters.location_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTickets((data as any) || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: CreateTicketData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          ...ticketData,
          reported_by_user_id: user.id,
          status: 'open'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ticket created successfully",
      });

      await fetchTickets();
      return data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create ticket",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTicket = async (ticketData: UpdateTicketData) => {
    try {
      const { id, ...updateData } = ticketData;
      
      // If status is being changed to resolved, set resolved_at
      if (updateData.status === 'resolved' || updateData.status === 'closed') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });

      await fetchTickets();
      return data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTicket = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticketId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ticket deleted successfully",
      });

      await fetchTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Error",
        description: "Failed to delete ticket",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    fetchTickets,
    createTicket,
    updateTicket,
    deleteTicket,
    refreshTickets: fetchTickets
  };
};