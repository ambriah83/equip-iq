
import React, { useState } from 'react';
import { Package, Edit, Phone, MessageSquare, Star, Mail, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useSettings } from '@/contexts/SettingsContext';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { useViewToggle } from '@/hooks/useViewToggle';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DataTable, FilterBar, CSVImportDialog } from '@/components/shared';
import { VendorCard, AddVendorDialog, EditVendorDialog, VendorChatbot } from '@/components/vendor';
import ViewToggle from './ViewToggle';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommunicationLog {
  id: string;
  type: 'call' | 'text' | 'email';
  date: string;
  duration?: string;
  notes: string;
  issueId?: string;
}

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
  // Legacy fields for backward compatibility
  name?: string;
  type?: string;
  email?: string;
  address?: string;
  isFirstChoice?: boolean;
  rating?: number;
  lastContacted?: string;
  preferredContact?: 'phone' | 'text' | 'email';
  communicationLog?: CommunicationLog[];
  serviceLocations?: string[];
}

const VendorManagement = () => {
  const { view, setView } = useViewToggle();
  const { settings } = useSettings();
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();
  
  const [vendors, setVendors] = useLocalStorage<Vendor[]>('vendors', []);

  // Load vendors from database on component mount
  React.useEffect(() => {
    loadVendorsFromDatabase();
  }, []);

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

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    showFilters,
    setShowFilters,
    filteredData: filteredVendors,
    clearAllFilters,
    hasActiveFilters
  } = useDataFiltering({
    data: vendors,
    searchFields: ['company_name', 'equipment_type', 'contact_name', 'notes'],
    filterConfigs: {
      equipment_type: 'Equipment Type'
    }
  });

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowEditDialog(true);
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
          // Map CSV columns to database fields
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

          // Validate required fields
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

      // Reload vendors from database
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

  const columns = [
    {
      key: 'company_name',
      label: 'Company',
      render: (vendor: Vendor) => (
        <div className="font-medium">{vendor.company_name}</div>
      )
    },
    {
      key: 'equipment_type',
      label: 'Equipment Type',
      render: (vendor: Vendor) => (
        <Badge variant="outline">{vendor.equipment_type}</Badge>
      )
    },
    {
      key: 'equipment_name',
      label: 'Equipment Name'
    },
    {
      key: 'contact_name',
      label: 'Contact'
    },
    {
      key: 'phone',
      label: 'Phone'
    },
    {
      key: 'website_email',
      label: 'Email/Website'
    },
    {
      key: 'vendor_department',
      label: 'Department'
    }
  ];

  const renderActions = (vendor: Vendor) => (
    <div className="flex gap-1">
      {vendor.phone && (
        <>
          <Button size="sm" variant="ghost" onClick={() => handleCall(vendor)}>
            <Phone size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleText(vendor)}>
            <MessageSquare size={16} />
          </Button>
        </>
      )}
      {vendor.website_email && (
        <Button size="sm" variant="ghost" onClick={() => handleEmail(vendor)}>
          <Mail size={16} />
        </Button>
      )}
    </div>
  );

  const equipmentTypes = [...new Set(vendors.map(v => v.equipment_type).filter(Boolean))];
  
  const filterConfigs = [
    {
      key: 'equipment_type',
      label: 'Equipment Type',
      options: equipmentTypes.map(type => ({ value: type, label: type })),
      value: filters.equipment_type,
      onChange: (value: string) => updateFilter('equipment_type', value)
    }
  ];

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVendors.map((vendor) => (
        <div key={vendor.id} className="bg-white rounded-lg border p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{vendor.company_name}</h3>
              <Badge variant="outline" className="mt-1">{vendor.equipment_type}</Badge>
            </div>
            <Button size="sm" variant="ghost" onClick={() => handleEdit(vendor)}>
              <Edit size={16} />
            </Button>
          </div>
          
          {vendor.equipment_name && (
            <p className="text-sm text-gray-600">{vendor.equipment_name}</p>
          )}
          
          {vendor.contact_name && (
            <p className="text-sm"><strong>Contact:</strong> {vendor.contact_name}</p>
          )}
          
          {vendor.vendor_department && (
            <p className="text-sm"><strong>Department:</strong> {vendor.vendor_department}</p>
          )}
          
          <div className="flex gap-2 pt-2">
            {vendor.phone && (
              <>
                <Button size="sm" variant="outline" onClick={() => handleCall(vendor)}>
                  <Phone size={14} className="mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleText(vendor)}>
                  <MessageSquare size={14} className="mr-1" />
                  Text
                </Button>
              </>
            )}
            {vendor.website_email && (
              <Button size="sm" variant="outline" onClick={() => handleEmail(vendor)}>
                <Mail size={14} className="mr-1" />
                Email
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const sampleVendorData = {
    equipment_type: 'Tanning Bed',
    equipment_name: 'SunMaster 3000',
    company_name: 'SunTech Solutions',
    vendor_department: 'Service Department',
    contact_name: 'John Smith',
    phone: '555-123-4567',
    website_email: 'service@suntech.com',
    notes: 'Specializes in tanning bed maintenance'
  };

  const requiredVendorFields = ['equipment_type', 'company_name'];
  const vendorFieldDescriptions = {
    equipment_type: 'Type of equipment (e.g., Tanning Bed, HVAC)',
    equipment_name: 'Specific equipment model or name',
    company_name: 'Vendor company name',
    vendor_department: 'Department within the vendor company',
    contact_name: 'Primary contact person',
    phone: 'Contact phone number',
    website_email: 'Email address or website',
    notes: 'Additional notes about the vendor'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package size={24} />
            <div>
              <h2 className="text-xl font-bold">Vendor Management</h2>
              <p className="text-blue-100">Manage supplier relationships and vendor information</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <Button onClick={() => setShowImportDialog(true)} variant="secondary">
              <Upload size={16} className="mr-2" />
              Import Vendors
            </Button>
            <AddVendorDialog onAddVendor={handleAddVendor} />
          </div>
        </div>
      </div>

      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search vendors by company, equipment type, contact, or notes..."
        filters={filterConfigs}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearAll={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredVendors.length}
        totalCount={vendors.length}
      />

      {view === 'card' ? renderCardView() : (
        <DataTable
          data={filteredVendors}
          columns={columns}
          onEdit={handleEdit}
          actions={renderActions}
        />
      )}

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">
            <Package size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">No vendors found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <EditVendorDialog
        vendor={editingVendor}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdateVendor={handleUpdateVendor}
      />

      <CSVImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        title="Vendors"
        onImport={handleImportVendors}
        sampleData={sampleVendorData}
        requiredFields={requiredVendorFields}
        fieldDescriptions={vendorFieldDescriptions}
      />

      <VendorChatbot />
    </div>
  );
};

export default VendorManagement;
