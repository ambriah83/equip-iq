
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserInvitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invitation_token: string;
  expires_at: string;
  created_at: string;
  invited_by?: string;
}

export const useUserInvitations = () => {
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: UserInvitation[] = (data || []).map(invitation => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status as 'pending' | 'accepted' | 'expired' | 'cancelled',
        invitation_token: invitation.invitation_token,
        expires_at: invitation.expires_at,
        created_at: invitation.created_at,
        invited_by: invitation.invited_by
      }));
      
      setInvitations(transformedData);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch invitations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const sendInvitation = useCallback(async (email: string, role: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('send-invitation', {
        body: {
          email,
          role,
          invitedBy: user.id,
          companyName: 'EquipIQ Team'
        }
      });

      if (error) throw error;

      toast({
        title: "Invitation Sent",
        description: `Invitation has been sent to ${email}`,
      });

      await fetchInvitations();
      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, fetchInvitations]);

  const cancelInvitation = useCallback(async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('user_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation Cancelled",
        description: "The invitation has been cancelled",
      });

      await fetchInvitations();
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive",
      });
    }
  }, [toast, fetchInvitations]);

  const resendInvitation = useCallback(async (invitation: UserInvitation) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Update expiry date and resend
      const { error: updateError } = await supabase
        .from('user_invitations')
        .update({ 
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      const { error } = await supabase.functions.invoke('send-invitation', {
        body: {
          email: invitation.email,
          role: invitation.role,
          invitedBy: user.id,
          companyName: 'EquipIQ Team'
        }
      });

      if (error) throw error;

      toast({
        title: "Invitation Resent",
        description: `Invitation has been resent to ${invitation.email}`,
      });

      await fetchInvitations();
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to resend invitation",
      });
    }
  }, [toast, fetchInvitations]);

  return {
    invitations,
    loading,
    fetchInvitations,
    sendInvitation,
    cancelInvitation,
    resendInvitation
  };
};
