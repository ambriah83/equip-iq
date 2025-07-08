import React from 'react';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { useViewToggle } from '@/hooks/useViewToggle';
import { DataTable, FilterBar, CSVImportDialog } from '@/components/shared';
import { VendorCard, AddVendorDialog, EditVendorDialog, VendorContactDialog, VendorChatbot } from '@/components/vendor';
import VendorHeader from '@/components/vendor/VendorHeader';
import VendorList from '@/components/vendor/VendorList';
import { useVendorManagement } from '@/components/vendor/VendorManagementHooks';

const VendorManagement = () => {
  const { view, setView } = useViewToggle();
  const {
    vendors,
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
  } = useVendorManagement();

  // Load vendors from database on component mount
  React.useEffect(() => {
    loadVendorsFromDatabase();
  }, []);

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
      <VendorHeader
        view={view}
        onViewChange={setView}
        onShowImportDialog={() => setShowImportDialog(true)}
        onAddVendor={handleAddVendor}
      />

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

      <VendorList
        vendors={filteredVendors}
        view={view}
        onEdit={handleEdit}
        onCall={handleCall}
        onText={handleText}
        onEmail={handleEmail}
      />

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