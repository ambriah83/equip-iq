import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { TicketComment } from '@/types/Ticket';

type TicketCommentRow = Database['public']['Tables']['ticket_comments']['Row'];
type TicketCommentInsert = Database['public']['Tables']['ticket_comments']['Insert'];

export interface TicketCommentWithUser extends TicketComment {
  user_name?: string;
  user_email?: string;
}

export const useTicketComments = (ticketId: string) => {
  const [comments, setComments] = useState<TicketCommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ticket_comments')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Get user profiles for the comments
      const userIds = [...new Set(data?.map(comment => comment.user_id))];
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, email')
        .in('id', userIds);
      
      // Transform the data to include user information
      const transformedData: TicketCommentWithUser[] = (data || []).map(item => {
        const userProfile = profiles?.find(profile => profile.id === item.user_id);
        return {
          id: item.id,
          ticket_id: item.ticket_id,
          user_id: item.user_id,
          comment: item.comment,
          created_at: item.created_at,
          user_name: userProfile 
            ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
            : undefined,
          user_email: userProfile?.email || undefined
        };
      });
      
      setComments(transformedData);
    } catch (err) {
      console.error('Error fetching ticket comments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (comment: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const insertData: TicketCommentInsert = {
        ticket_id: ticketId,
        user_id: user.user.id,
        comment
      };

      const { data, error } = await supabase
        .from('ticket_comments')
        .insert(insertData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Get user profile for the new comment
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, email')
        .eq('id', user.user.id)
        .single();
      
      const transformedData: TicketCommentWithUser = {
        id: data.id,
        ticket_id: data.ticket_id,
        user_id: data.user_id,
        comment: data.comment,
        created_at: data.created_at,
        user_name: userProfile 
          ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
          : undefined,
        user_email: userProfile?.email || undefined
      };
      
      setComments(prev => [...prev, transformedData]);
      return transformedData;
    } catch (err) {
      console.error('Error creating comment:', err);
      throw err;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('ticket_comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchComments();
    }
  }, [ticketId]);

  return {
    comments,
    loading,
    error,
    createComment,
    deleteComment,
    refetch: fetchComments
  };
};