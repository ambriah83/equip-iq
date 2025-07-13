
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useVendorContacts } from '@/hooks/useVendorContacts';
import { 
  Vendor, 
  VendorWithContacts, 
  CreateVendorData, 
  UpdateVendorData, 
  VendorImportResult 
} from '@/types/Vendor';

export const useVendorManagement = () => {
  const [vendors, setVendors] = useState<VendorWithContacts[]>([]);
  const [editingVendor, setEditingVendor] = useState<VendorWithContacts | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { contacts, loadContactsForVendor } = useVendorContacts();

  const loadVendorsFromDatabase = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Load vendors with their contacts
        const vendorsWithContacts = await Promise.all(
          data.map(async (vendor) => {
            try {
              const { data: contactsData } = await supabase
                .from('vendor_contacts')
                .select('*')
                .eq('vendor_id', vendor.id)
                .order('is_primary', { ascending: false });

              const primaryContact = contactsData?.find(contact => contact.is_primary);
              
              return {
                ...vendor,
                contacts: contactsData || [],
                primary_contact: primaryContact
              } as VendorWithContacts;
            } catch (contactError) {
              console.error('Error loading contacts for vendor:', vendor.id, contactError);
              return {
                ...vendor,
                contacts: [],
                primary_contact: undefined
              } as VendorWithContacts;
            }
          })
        );

        setVendors(vendorsWithContacts);
      } else {
        setVendors([]);
      }
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (newVendorData: CreateVendorData) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert([newVendorData])
        .select()
        .single();

      if (error) throw error;

      const newVendor: VendorWithContacts = {
        ...data,
        contacts: [],
        primary_contact: undefined
      };

      setVendors(prev => [newVendor, ...prev]);
      toast({
        title: "Success",
        description: "Vendor added successfully",
      });

      return data;
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast({
        title: "Error",
        description: "Failed to add vendor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleUpdateVendor = async (updatedVendorData: UpdateVendorData) => {
    try {
      const { id, ...updateData } = updatedVendorData;
      
      const { data, error } = await supabase
        .from('vendors')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVendors(prev => prev.map(vendor => 
        vendor.id === id ? { ...vendor, ...data } : vendor
      ));
      
      toast({
        title: "Success",
        description: "Vendor updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleImportVendors = async (data: any[]): Promise<VendorImportResult> => {
    try {
      let processed = 0;
      const errors: string[] = [];

      for (const row of data) {
        try {
          const vendorData: CreateVendorData = {
            equipment_type: row['Equipment Type'] || row['equipment_type'] || '',
            equipment_name: row['Equipment Name'] || row['equipment_name'] || '',
            company_name: row['Company Name'] || row['company_name'] || '',
            vendor_department: row['Vendor Department'] || row['vendor_department'] || '',
            contact_name: row['Contact Name'] || row['contact_name'] || '',
            phone: row['Phone'] || row['phone'] || '',
            website_email: row['Website/Email'] || row['website_email'] || row['email'] || '',
            notes: row['Notes'] || row['notes'] || ''
          };

          if (!vendorData.equipment_type || !vendorData.company_name) {
            errors.push(`Row ${processed + 1}: Equipment Type and Company Name are required`);
            continue;
          }

          const { error } = await supabase
            .from('vendors')
            .insert([vendorData]);

          if (error) {
            errors.push(`Row ${processed + 1}: ${error.message}`);
          } else {
            processed++;
          }
        } catch (error) {
          errors.push(`Row ${processed + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      await loadVendorsFromDatabase();

      return {
        success: processed > 0,
        processed,
        errors
      };
    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      };
    }
  };

  const handleEdit = (vendor: VendorWithContacts) => {
    setEditingVendor(vendor);
    setShowEditDialog(true);
  };

  const handleCall = (vendor: VendorWithContacts) => {
    // Use primary contact phone if available, otherwise fall back to vendor phone
    const phone = vendor.primary_contact?.phone || vendor.phone;
    if (phone) {
      window.open(`tel:${phone}`);
    } else {
      toast({
        title: "No Phone Number",
        description: "No phone number available for this vendor",
        variant: "destructive"
      });
    }
  };

  const handleText = (vendor: VendorWithContacts) => {
    // Use primary contact phone if available, otherwise fall back to vendor phone
    const phone = vendor.primary_contact?.phone || vendor.phone;
    if (phone) {
      window.open(`sms:${phone}`);
    } else {
      toast({
        title: "No Phone Number",
        description: "No phone number available for this vendor",
        variant: "destructive"
      });
    }
  };

  const handleEmail = (vendor: VendorWithContacts) => {
    // Use primary contact email if available, otherwise fall back to vendor email
    const email = vendor.primary_contact?.email || vendor.website_email;
    if (email) {
      window.open(`mailto:${email}`);
    } else {
      toast({
        title: "No Email Address",
        description: "No email address available for this vendor",
        variant: "destructive"
      });
    }
  };

  // Load vendors on mount
  useEffect(() => {
    loadVendorsFromDatabase();
  }, []);

  return {
    vendors,
    setVendors,
    editingVendor,
    showEditDialog,
    setShowEditDialog,
    showImportDialog,
    setShowImportDialog,
    loading,
    loadVendorsFromDatabase,
    handleAddVendor,
    handleUpdateVendor,
    handleImportVendors,
    handleEdit,
    handleCall,
    handleText,
    handleEmail
  };
};
