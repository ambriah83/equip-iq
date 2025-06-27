
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
    'Location Name': 'Glo Tanning - Sample Location',
    'Tan-Link or SunLync': 'GL_Sample',
    address: '123 Main St, City, State 12345',
    'STORE MANAGER': 'Jane Smith',
    'Direct Store Line': '(555) 123-4567',
    email: 'sample@glotanning.com',
    'Corporate or Franchise': 'Franchise',
    status: 'active'
  };

  const requiredFields = ['Location Name', 'Tan-Link or SunLync', 'address'];

  const fieldDescriptions = {
    'Location Name': 'Full name of the location (e.g., "Glo Tanning - City Name")',
    'Tan-Link or SunLync': 'Location code/abbreviation for equipment connection',
    address: 'Complete street address',
    'STORE MANAGER': 'Name of the location manager (optional)',
    'Direct Store Line': 'Phone number (optional)',
    email: 'Email address (optional)',
    'Corporate or Franchise': 'Ownership type: Corporate or Franchise (optional)',
    status: 'Status: active, maintenance, or closed (optional, defaults to active)',
    notes: 'Additional notes about the location (optional)'
  };

  // Enhanced column mapping function specifically for your CSV format
  const mapColumnValue = (row: any, possibleKeys: string[], fallbackKeys: string[] = []) => {
    // Try exact matches first
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return row[key];
      }
    }
    
    // Try case-insensitive matches
    const rowKeys = Object.keys(row);
    for (const targetKey of possibleKeys) {
      const matchingKey = rowKeys.find(key => 
        key.toLowerCase() === targetKey.toLowerCase()
      );
      if (matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== null && row[matchingKey] !== '') {
        return row[matchingKey];
      }
    }
    
    // Try fallback keys
    for (const key of fallbackKeys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return row[key];
      }
    }
    
    return '';
  };

  const handleImport = async (data: any[]) => {
    console.log('🚀 Starting enhanced location import with', data.length, 'records');
    
    // Log the import attempt
    try {
      await supabase.rpc('log_import_attempt', {
        operation_type: 'location_import_start',
        table_name: 'locations',
        details: { record_count: data.length, headers: Object.keys(data[0] || {}) }
      });
    } catch (error) {
      console.log('Logging failed (non-critical):', error);
    }

    const errors: string[] = [];
    let processed = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Account for header row
      
      console.log(`📍 Processing location row ${rowNum}:`, row);
      console.log(`📋 Available columns in row ${rowNum}:`, Object.keys(row));

      // Enhanced mapping for your specific CSV format
      const locationName = mapColumnValue(row, [
        'Location Name', 'LocationName', 'location name', 'LOCATION NAME',
        'name', 'Name', 'NAME', 'location', 'Location', 'LOCATION',
        'Store Name', 'store name', 'STORE NAME', 'Store', 'store', 'STORE'
      ]);

      const abbreviation = mapColumnValue(row, [
        'Tan-Link or SunLync', 'TanLink or SunLync', 'Tan-Link', 'TanLink',
        'SunLync', 'abbreviation', 'Abbreviation', 'ABBREVIATION',
        'Location Code', 'location code', 'LOCATION CODE',
        'Store Code', 'store code', 'STORE CODE', 'code', 'Code', 'CODE'
      ]);

      const address = mapColumnValue(row, [
        'address', 'Address', 'ADDRESS',
        'Street Address', 'street address', 'STREET ADDRESS',
        'Full Address', 'full address', 'FULL ADDRESS',
        'Location Address', 'location address', 'LOCATION ADDRESS'
      ]);

      const managerName = mapColumnValue(row, [
        'STORE MANAGER', 'Store Manager', 'store manager',
        'manager_name', 'Manager Name', 'manager name',
        'manager', 'Manager', 'MANAGER'
      ]);

      const phone = mapColumnValue(row, [
        'Direct Store Line', 'direct store line', 'DIRECT STORE LINE',
        'phone', 'Phone', 'PHONE',
        'Phone Number', 'phone number', 'PHONE NUMBER',
        'telephone', 'Telephone', 'TELEPHONE'
      ]);

      const email = mapColumnValue(row, [
        'email', 'Email', 'EMAIL',
        'Email Address', 'email address', 'EMAIL ADDRESS'
      ]);

      const ownershipType = mapColumnValue(row, [
        'Corporate or Franchise', 'corporate or franchise', 'CORPORATE OR FRANCHISE',
        'ownership_type', 'Ownership Type', 'ownership type',
        'type', 'Type', 'TYPE'
      ]);

      const status = mapColumnValue(row, [
        'status', 'Status', 'STATUS'
      ], ['active']);

      const notes = mapColumnValue(row, [
        'notes', 'Notes', 'NOTES',
        'comments', 'Comments', 'COMMENTS'
      ]);

      console.log(`🔄 Mapped values for row ${rowNum}:`, {
        locationName: locationName?.toString()?.substring(0, 50),
        abbreviation: abbreviation?.toString()?.substring(0, 20),
        address: address?.toString()?.substring(0, 50),
        managerName: managerName?.toString()?.substring(0, 30),
        phone: phone?.toString()?.substring(0, 20),
        ownershipType: ownershipType?.toString()?.substring(0, 15)
      });

      // Validate required fields with detailed error messages
      if (!locationName || !locationName.toString().trim()) {
        const availableColumns = Object.keys(row).join(', ');
        errors.push(`Row ${rowNum}: Location name is required but not found. Available columns: ${availableColumns}`);
        continue;
      }

      if (!abbreviation || !abbreviation.toString().trim()) {
        const availableColumns = Object.keys(row).join(', ');
        errors.push(`Row ${rowNum}: "Tan-Link or SunLync" abbreviation is required but not found. Available columns: ${availableColumns}`);
        continue;
      }

      if (!address || !address.toString().trim()) {
        const availableColumns = Object.keys(row).join(', ');
        errors.push(`Row ${rowNum}: Address is required but not found. Available columns: ${availableColumns}`);
        continue;
      }

      // Normalize ownership type
      let normalizedOwnershipType = 'franchise'; // Default
      if (ownershipType) {
        const ownershipStr = ownershipType.toString().toLowerCase();
        if (ownershipStr.includes('corporate')) {
          normalizedOwnershipType = 'corporate';
        } else if (ownershipStr.includes('franchise')) {
          normalizedOwnershipType = 'franchise';
        }
      }

      // Normalize status
      const normalizedStatus = (status?.toString()?.toLowerCase() || 'active');
      if (!['active', 'maintenance', 'closed'].includes(normalizedStatus)) {
        errors.push(`Row ${rowNum}: Invalid status "${normalizedStatus}". Must be 'active', 'maintenance', or 'closed'`);
        continue;
      }

      try {
        console.log(`💾 Inserting location ${rowNum} into database...`);
        
        const locationData = {
          name: locationName.toString().trim(),
          abbreviation: abbreviation.toString().trim(),
          address: address.toString().trim(),
          manager_name: managerName?.toString()?.trim() || null,
          phone: phone?.toString()?.trim() || null,
          email: email?.toString()?.trim() || null,
          ownership_type: normalizedOwnershipType,
          status: normalizedStatus,
          notes: notes?.toString()?.trim() || null
        };

        // Log the insertion attempt
        try {
          await supabase.rpc('log_import_attempt', {
            operation_type: 'location_insert',
            table_name: 'locations',
            details: { row_number: rowNum, data: locationData }
          });
        } catch (logError) {
          console.log('Logging failed (non-critical):', logError);
        }

        // Insert into Supabase
        const { error } = await supabase
          .from('locations')
          .insert(locationData);

        if (error) {
          console.error(`❌ Database error for row ${rowNum}:`, error);
          if (error.code === '23505') { // Unique constraint violation
            errors.push(`Row ${rowNum}: Location with abbreviation "${abbreviation}" already exists`);
          } else {
            errors.push(`Row ${rowNum}: Database error - ${error.message}`);
          }
          continue;
        }

        console.log(`✅ Location row ${rowNum} inserted successfully`);
        processed++;
      } catch (error) {
        console.error(`💥 Unexpected error for row ${rowNum}:`, error);
        errors.push(`Row ${rowNum}: Unexpected error occurred`);
      }
    }

    console.log(`🎯 Location import completed: ${processed} processed, ${errors.length} errors`);

    // Log the final result
    try {
      await supabase.rpc('log_import_attempt', {
        operation_type: 'location_import_complete',
        table_name: 'locations',
        details: { processed, errors: errors.length, error_messages: errors.slice(0, 5) }
      });
    } catch (logError) {
      console.log('Final logging failed (non-critical):', logError);
    }

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
