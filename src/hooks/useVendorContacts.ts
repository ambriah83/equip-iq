import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VendorContact, CreateVendorContactData, UpdateVendorContactData } from '@/types/VendorContact';

export const useVendorContacts = () => {
  const [contacts, setContacts] = useState<VendorContact[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadContactsForVendor = useCallback(async (vendorId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vendor_contacts')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading vendor contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load vendor contacts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addContact = useCallback(async (contactData: CreateVendorContactData) => {
    try {
      // If this is set as primary, first remove primary status from others
      if (contactData.is_primary) {
        await supabase
          .from('vendor_contacts')
          .update({ is_primary: false })
          .eq('vendor_id', contactData.vendor_id);
      }

      const { data, error } = await supabase
        .from('vendor_contacts')
        .insert([contactData])
        .select()
        .single();

      if (error) throw error;

      setContacts(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Contact added successfully",
      });

      return data;
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const updateContact = useCallback(async (contactId: string, updates: UpdateVendorContactData) => {
    try {
      // If setting as primary, first remove primary status from others
      if (updates.is_primary) {
        const contact = contacts.find(c => c.id === contactId);
        if (contact) {
          await supabase
            .from('vendor_contacts')
            .update({ is_primary: false })
            .eq('vendor_id', contact.vendor_id)
            .neq('id', contactId);
        }
      }

      const { data, error } = await supabase
        .from('vendor_contacts')
        .update(updates)
        .eq('id', contactId)
        .select()
        .single();

      if (error) throw error;

      setContacts(prev => prev.map(contact => 
        contact.id === contactId ? data : contact
      ));

      toast({
        title: "Success",
        description: "Contact updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive"
      });
      throw error;
    }
  }, [contacts, toast]);

  const deleteContact = useCallback(async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('vendor_contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const setPrimaryContact = useCallback(async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    try {
      // Remove primary status from all contacts for this vendor
      await supabase
        .from('vendor_contacts')
        .update({ is_primary: false })
        .eq('vendor_id', contact.vendor_id);

      // Set the selected contact as primary
      const { data, error } = await supabase
        .from('vendor_contacts')
        .update({ is_primary: true })
        .eq('id', contactId)
        .select()
        .single();

      if (error) throw error;

      setContacts(prev => prev.map(c => ({
        ...c,
        is_primary: c.id === contactId
      })));

      toast({
        title: "Success",
        description: "Primary contact updated",
      });
    } catch (error) {
      console.error('Error setting primary contact:', error);
      toast({
        title: "Error",
        description: "Failed to set primary contact",
        variant: "destructive"
      });
    }
  }, [contacts, toast]);

  return {
    contacts,
    loading,
    loadContactsForVendor,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact
  };
};