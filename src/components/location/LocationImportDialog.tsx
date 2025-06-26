
import React from 'react';
import CSVImportDialog from '@/components/shared/CSVImportDialog';
import { supabase } from '@/integrations/supabase/client';

interface LocationImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationsImported: () => void;
}

const LocationImportDialog: React.FC<LocationImportDialogProps> = ({
  isOpen,
  onClose,
  onLocationsImported
}) => {
  const sampleData = {
    name: 'Glo Tanning - Sample Location',
    abbreviation: 'GL_Sample',
    address: '123 Main St, City, State 12345',
    manager_name: 'Jane Smith',
    phone: '(555) 123-4567',
    email: 'sample@glotanning.com',
    status: 'active'
  };

  const requiredFields = ['name', 'abbreviation', 'address'];

  const fieldDescriptions = {
    name: 'Full name of the location (e.g., "Glo Tanning - City Name")',
    abbreviation: 'Location code/abbreviation (e.g., "FL_Tampa")',
    address: 'Complete street address',
    manager_name: 'Name of the location manager (optional)',
    phone: 'Phone number (optional)',
    email: 'Email address (optional)',
    status: 'Status: active, maintenance, or closed (optional, defaults to active)',
    notes: 'Additional notes about the location (optional)'
  };

  const handleImport = async (data: any[]) => {
    console.log('Starting location import with', data.length, 'records');
    const errors: string[] = [];
    let processed = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Account for header row
      console.log(`Processing location row ${rowNum}:`, row);

      // Try multiple possible column name mappings for better flexibility
      const locationName = row.name || row.Name || row['Location Name'] || row['Store Name'] || row.location || row.store || '';
      const abbreviation = row.abbreviation || row.Abbreviation || row['Location Code'] || row.code || row.abbrev || '';
      const address = row.address || row.Address || row['Street Address'] || row.location_address || '';
      const managerName = row.manager_name || row['Manager Name'] || row.manager || row['Area Manager'] || row['Store Manager'] || '';
      const phone = row.phone || row.Phone || row['Phone Number'] || row.telephone || '';
      const email = row.email || row.Email || row['Email Address'] || row.contact_email || '';
      const status = row.status || row.Status || 'active';

      // Validate required fields
      if (!locationName.trim()) {
        // Provide more helpful error message with suggestions
        const availableColumns = Object.keys(row).join(', ');
        errors.push(`Row ${rowNum}: Location name is required. Available columns: ${availableColumns}. Expected columns like: name, Name, Location Name, Store Name`);
        continue;
      }

      if (!abbreviation.trim()) {
        const availableColumns = Object.keys(row).join(', ');
        errors.push(`Row ${rowNum}: Location abbreviation/code is required. Available columns: ${availableColumns}. Expected columns like: abbreviation, Location Code, code`);
        continue;
      }

      if (!address.trim()) {
        const availableColumns = Object.keys(row).join(', ');
        errors.push(`Row ${rowNum}: Address is required. Available columns: ${availableColumns}. Expected columns like: address, Address, Street Address`);
        continue;
      }

      // Validate status if provided
      if (status && !['active', 'maintenance', 'closed'].includes(status.toLowerCase())) {
        errors.push(`Row ${rowNum}: Invalid status "${status}". Must be 'active', 'maintenance', or 'closed'`);
        continue;
      }

      try {
        console.log(`Inserting location ${rowNum} into database...`);
        
        // Insert into Supabase
        const { error } = await supabase
          .from('locations')
          .insert({
            name: locationName.trim(),
            abbreviation: abbreviation.trim(),
            address: address.trim(),
            manager_name: managerName?.trim() || null,
            phone: phone?.trim() || null,
            email: email?.trim() || null,
            status: status?.toLowerCase() || 'active',
            notes: row.notes?.trim() || null
          });

        if (error) {
          console.error(`Database error for row ${rowNum}:`, error);
          if (error.code === '23505') { // Unique constraint violation
            errors.push(`Row ${rowNum}: Location with this abbreviation already exists`);
          } else {
            errors.push(`Row ${rowNum}: Database error - ${error.message}`);
          }
          continue;
        }

        console.log(`Location row ${rowNum} inserted successfully`);
        processed++;
      } catch (error) {
        console.error(`Unexpected error for row ${rowNum}:`, error);
        errors.push(`Row ${rowNum}: Unexpected error occurred`);
      }
    }

    console.log(`Location import completed: ${processed} processed, ${errors.length} errors`);

    // Trigger refresh of location list
    if (processed > 0) {
      onLocationsImported();
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
      title="Locations"
      onImport={handleImport}
      sampleData={sampleData}
      requiredFields={requiredFields}
      fieldDescriptions={fieldDescriptions}
    />
  );
};

export default LocationImportDialog;
