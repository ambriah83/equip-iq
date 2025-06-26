
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
      console.log(`Available columns in row ${rowNum}:`, Object.keys(row));

      // Enhanced column mapping - try many more variations for location name
      const locationName = row.name || row.Name || row.NAME || 
                          row['Location Name'] || row['location name'] || row['LOCATION NAME'] ||
                          row['location'] || row['Location'] || row['LOCATION'] ||
                          row['Store Name'] || row['store name'] || row['STORE NAME'] ||
                          row['Store'] || row['store'] || row['STORE'] ||
                          row['Business Name'] || row['business name'] || row['BUSINESS NAME'] ||
                          row['Company'] || row['company'] || row['COMPANY'] ||
                          row['Shop Name'] || row['shop name'] || row['SHOP NAME'] ||
                          row['Branch'] || row['branch'] || row['BRANCH'] ||
                          row['Site'] || row['site'] || row['SITE'] ||
                          // Try using the first column if it looks like a name
                          Object.values(row)[0] || '';

      const abbreviation = row.abbreviation || row.Abbreviation || row.ABBREVIATION ||
                          row['Location Code'] || row['location code'] || row['LOCATION CODE'] ||
                          row['Store Code'] || row['store code'] || row['STORE CODE'] ||
                          row.code || row.Code || row.CODE ||
                          row.abbrev || row.Abbrev || row.ABBREV ||
                          row['Short Name'] || row['short name'] || row['SHORT NAME'] ||
                          row.id || row.ID || row.Id ||
                          // Try using the second column as abbreviation if first is name
                          Object.values(row)[1] || '';

      const address = row.address || row.Address || row.ADDRESS ||
                     row['Street Address'] || row['street address'] || row['STREET ADDRESS'] ||
                     row['Full Address'] || row['full address'] || row['FULL ADDRESS'] ||
                     row.location_address || row['Location Address'] || row['LOCATION ADDRESS'] ||
                     row['Physical Address'] || row['physical address'] || row['PHYSICAL ADDRESS'] ||
                     // Look for any column that might contain address info
                     Object.entries(row).find(([key, value]) => 
                       key.toLowerCase().includes('address') && value
                     )?.[1] || '';

      const managerName = row.manager_name || row['Manager Name'] || row['manager name'] || 
                         row.manager || row.Manager || row.MANAGER ||
                         row['Area Manager'] || row['area manager'] || row['AREA MANAGER'] ||
                         row['Store Manager'] || row['store manager'] || row['STORE MANAGER'] ||
                         row['Branch Manager'] || row['branch manager'] || row['BRANCH MANAGER'] || '';

      const phone = row.phone || row.Phone || row.PHONE ||
                   row['Phone Number'] || row['phone number'] || row['PHONE NUMBER'] ||
                   row.telephone || row.Telephone || row.TELEPHONE || '';

      const email = row.email || row.Email || row.EMAIL ||
                   row['Email Address'] || row['email address'] || row['EMAIL ADDRESS'] ||
                   row.contact_email || row['Contact Email'] || row['CONTACT EMAIL'] || '';

      const status = (row.status || row.Status || row.STATUS || 'active').toLowerCase();

      console.log(`Mapped values for row ${rowNum}:`, {
        locationName: locationName?.toString()?.substring(0, 50),
        abbreviation: abbreviation?.toString()?.substring(0, 20),
        address: address?.toString()?.substring(0, 50)
      });

      // Validate required fields with better error messages
      if (!locationName || !locationName.toString().trim()) {
        const availableColumns = Object.keys(row).join(', ');
        const firstFewValues = Object.entries(row).slice(0, 5).map(([key, value]) => `${key}: "${value}"`).join(', ');
        errors.push(`Row ${rowNum}: Location name is required but not found. Available columns: ${availableColumns}. First few values: ${firstFewValues}`);
        continue;
      }

      if (!abbreviation || !abbreviation.toString().trim()) {
        const availableColumns = Object.keys(row).join(', ');
        errors.push(`Row ${rowNum}: Location abbreviation/code is required but not found. Available columns: ${availableColumns}. Try adding a column like 'abbreviation', 'code', or 'Location Code'`);
        continue;
      }

      if (!address || !address.toString().trim()) {
        const availableColumns = Object.keys(row).join(', ');
        errors.push(`Row ${rowNum}: Address is required but not found. Available columns: ${availableColumns}. Try adding a column like 'address', 'Address', or 'Street Address'`);
        continue;
      }

      // Validate status if provided
      if (status && !['active', 'maintenance', 'closed'].includes(status)) {
        errors.push(`Row ${rowNum}: Invalid status "${status}". Must be 'active', 'maintenance', or 'closed'`);
        continue;
      }

      try {
        console.log(`Inserting location ${rowNum} into database...`);
        
        // Insert into Supabase
        const { error } = await supabase
          .from('locations')
          .insert({
            name: locationName.toString().trim(),
            abbreviation: abbreviation.toString().trim(),
            address: address.toString().trim(),
            manager_name: managerName?.toString()?.trim() || null,
            phone: phone?.toString()?.trim() || null,
            email: email?.toString()?.trim() || null,
            status: status || 'active',
            notes: row.notes?.toString()?.trim() || null
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
