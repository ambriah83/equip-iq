
import React from 'react';
import CSVImportDialog from '@/components/shared/CSVImportDialog';
import { supabase } from '@/integrations/supabase/client';

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
    console.log('First row data:', data[0]); // Log first row to see structure
    console.log('Available fields:', data[0] ? Object.keys(data[0]) : 'No data');
    
    const errors: string[] = [];
    let processed = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Account for header row
      
      // Skip empty rows
      if (!row || Object.keys(row).length === 0) {
        console.log(`Skipping empty row ${rowNum}`);
        continue;
      }
      
      // Skip rows that look like AI error messages
      const firstValue = Object.values(row)[0] as string;
      if (firstValue && (
        firstValue.includes('To process the provided CSV') ||
        firstValue.includes('extract and map the relevant') ||
        firstValue.includes('I will extract') ||
        firstValue.includes('structured correctly')
      )) {
        console.log(`Skipping AI message row ${rowNum}`);
        continue;
      }
      
      console.log(`Processing vendor row ${rowNum}:`, row);
      console.log(`Row keys:`, Object.keys(row));

      // Try multiple possible column name mappings - including variations the AI might use
      const equipmentType = row.equipment_type || 
                           row['Equipment Type'] || 
                           row['equipment type'] || 
                           row['equipment_type'] ||
                           row['Equipment TYPE'] ||  // Excel header from screenshot
                           row.type || 
                           row.Type ||
                           row['type'] ||
                           row.equipmentType ||
                           row.EquipmentType ||
                           '';
                           
      const companyName = row.company_name || 
                         row['Company Name'] || 
                         row['company name'] || 
                         row['company_name'] ||
                         row.company || 
                         row.Company ||
                         row['company'] ||
                         row.companyName ||
                         row.CompanyName ||
                         row.vendor ||
                         row.Vendor ||
                         row['vendor'] ||
                         '';

      console.log(`Extracted values - Equipment Type: "${equipmentType}", Company Name: "${companyName}"`);
      
      // Validate required fields
      if (!equipmentType.trim()) {
        errors.push(`Row ${rowNum}: Equipment Type is required (checked fields: ${Object.keys(row).join(', ')})`);
        continue;
      }

      if (!companyName.trim()) {
        errors.push(`Row ${rowNum}: Company Name is required (available: ${Object.keys(row).join(', ')})`);
        continue;
      }

      console.log(`Vendor row ${rowNum} validated successfully`);
      
      // Check if vendor already exists
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('company_name', companyName.trim())
        .eq('equipment_types', equipmentType.trim())
        .maybeSingle();
      
      if (existingVendor) {
        console.log(`Vendor already exists at row ${rowNum}: ${companyName} - ${equipmentType}`);
        // Skip silently - don't count as error
        console.log(`Skipping duplicate vendor`);
        continue;
      }
      
      // Prepare vendor data for insertion - with Excel headers from screenshot
      const vendorData = {
        company_name: companyName.trim(),
        equipment_types: equipmentType.trim(),
        vendor_department: (row.vendor_department || row['Vendor Department'] || row['vendor department'] || row['VENDOR DEPARTMENT'] || row.department || '').trim(),
        contact_name: (row.contact_name || row['Contact Name'] || row['contact name'] || row['CONTACT NAME'] || row.contact || '').trim(),
        phone: (row.phone || row['Phone'] || row['phone'] || row['PHONE #'] || row.phone_number || '').trim(),
        website_email: (row.website_email || row['Website Email'] || row['website email'] || row['Website/Email'] || row.email || row.website || '').trim(),
        notes: (row.notes || row['Notes'] || row['notes'] || '').trim()
      };
      
      // Remove empty fields
      Object.keys(vendorData).forEach(key => {
        if (vendorData[key] === '') {
          delete vendorData[key];
        }
      });
      
      console.log(`Inserting vendor:`, vendorData);
      
      // Insert vendor into database
      const { error: insertError } = await supabase
        .from('vendors')
        .insert(vendorData);
      
      if (insertError) {
        console.error(`Error inserting vendor at row ${rowNum}:`, insertError);
        errors.push(`Row ${rowNum}: ${insertError.message}`);
      } else {
        processed++;
      }
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
