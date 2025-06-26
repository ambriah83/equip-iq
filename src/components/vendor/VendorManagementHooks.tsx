
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Vendor {
  id: string;
  equipment_type: string;
  equipment_name?: string;
  company_name: string;
  vendor_department?: string;
  contact_name?: string;
  phone?: string;
  website_email?: string;
  notes?: string;
}

export const useVendorManagement = () => {
  const [vendors, setVendors] = useLocalStorage<Vendor[]>('vendors', []);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();

  const loadVendorsFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setVendors(data);
      }
    } catch (error) {
      console.error('Error loading vendors:', error);
    }
  };

  const handleAddVendor = async (newVendor: Vendor) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert([{
          equipment_type: newVendor.equipment_type,
          equipment_name: newVendor.equipment_name,
          company_name: newVendor.company_name,
          vendor_department: newVendor.vendor_department,
          contact_name: newVendor.contact_name,
          phone: newVendor.phone,
          website_email: newVendor.website_email,
          notes: newVendor.notes
        }])
        .select()
        .single();

      if (error) throw error;

      setVendors(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Vendor added successfully",
      });
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast({
        title: "Error",
        description: "Failed to add vendor",
        variant: "destructive"
      });
    }
  };

  const handleUpdateVendor = async (updatedVendor: Vendor) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update({
          equipment_type: updatedVendor.equipment_type,
          equipment_name: updatedVendor.equipment_name,
          company_name: updatedVendor.company_name,
          vendor_department: updatedVendor.vendor_department,
          contact_name: updatedVendor.contact_name,
          phone: updatedVendor.phone,
          website_email: updatedVendor.website_email,
          notes: updatedVendor.notes
        })
        .eq('id', updatedVendor.id)
        .select()
        .single();

      if (error) throw error;

      setVendors(prev => prev.map(vendor => 
        vendor.id === updatedVendor.id ? data : vendor
      ));
      
      toast({
        title: "Success",
        description: "Vendor updated successfully",
      });
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive"
      });
    }
  };

  const handleImportVendors = async (data: any[]) => {
    try {
      let processed = 0;
      const errors: string[] = [];

      for (const row of data) {
        try {
          const vendorData = {
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

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowEditDialog(true);
  };

  const handleCall = (vendor: Vendor) => {
    const phone = vendor.phone;
    if (phone) {
      window.open(`tel:${phone}`);
    }
  };

  const handleText = (vendor: Vendor) => {
    const phone = vendor.phone;
    if (phone) {
      window.open(`sms:${phone}`);
    }
  };

  const handleEmail = (vendor: Vendor) => {
    const email = vendor.website_email;
    if (email) {
      window.open(`mailto:${email}`);
    }
  };

  return {
    vendors,
    setVendors,
    editingVendor,
    showEditDialog,
    setShowEditDialog,
    showImportDialog,
    setShowImportDialog,
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
