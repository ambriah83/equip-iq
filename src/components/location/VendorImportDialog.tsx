
import React from 'react';
import CSVImportDialog from '@/components/shared/CSVImportDialog';

interface VendorImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVendorsImported: () => void;
}

const VendorImportDialog: React.FC<VendorImportDialogProps> = ({
  isOpen,
  onClose,
  onVendorsImported
}) => {
  const sampleData = {
    equipment_type: 'Tanning Bed',
    equipment_name: 'SunMaster 3000',
    company_name: 'SunTech Solutions',
    vendor_department: 'Service Department',
    contact_name: 'John Smith',
    phone: '555-123-4567',
    website_email: 'service@company.com',
    notes: 'Preferred vendor for tanning bed maintenance'
  };

  const requiredFields = ['equipment_type', 'company_name'];

  const fieldDescriptions = {
    equipment_type: 'Type of equipment this vendor services (e.g., "Tanning Bed", "HVAC", "Plumbing")',
    equipment_name: 'Specific equipment model or name (optional)',
    company_name: 'Name of the vendor company',
    vendor_department: 'Department or division within the vendor company (optional)',
    contact_name: 'Primary contact person at the vendor (optional)',
    phone: 'Phone number for the vendor (optional)',
    website_email: 'Email address or website URL (optional)',
    notes: 'Additional notes about this vendor (optional)'
  };

  const handleImport = async (data: any[]) => {
    console.log('Starting vendor import with', data.length, 'records');
    const errors: string[] = [];
    let processed = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Account for header row
      console.log(`Processing vendor row ${rowNum}:`, row);

      // Try multiple possible column name mappings
      const equipmentType = row.equipment_type || row['Equipment Type'] || row['equipment type'] || row.type || '';
      const companyName = row.company_name || row['Company Name'] || row['company name'] || row.company || '';

      // Validate required fields
      if (!equipmentType.trim()) {
        errors.push(`Row ${rowNum}: Equipment Type is required`);
        continue;
      }

      if (!companyName.trim()) {
        errors.push(`Row ${rowNum}: Company Name is required`);
        continue;
      }

      console.log(`Vendor row ${rowNum} validated successfully`);
      processed++;
    }

    console.log(`Vendor import completed: ${processed} processed, ${errors.length} errors`);

    // Trigger refresh of vendor list
    if (processed > 0) {
      onVendorsImported();
    }

    return {
      success: errors.length === 0,
      processed,
      errors
    };
  };

  return (
    <CSVImportDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Vendors"
      onImport={handleImport}
      sampleData={sampleData}
      requiredFields={requiredFields}
      fieldDescriptions={fieldDescriptions}
    />
  );
};

export default VendorImportDialog;
