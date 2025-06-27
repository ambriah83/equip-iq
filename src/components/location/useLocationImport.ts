
import { supabase } from '@/integrations/supabase/client';
import { LocationColumnMapper } from './LocationColumnMapper';
import { LocationDataValidator } from './LocationDataValidator';

interface UseLocationImportProps {
  onLocationsImported: () => void;
}

export const useLocationImport = ({ onLocationsImported }: UseLocationImportProps) => {
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

      // Map columns using the mapper
      const mappedLocation = LocationColumnMapper.mapRowToLocation(row);
      console.log(`🔄 Mapped values for row ${rowNum}:`, {
        locationName: mappedLocation.locationName?.toString()?.substring(0, 50),
        abbreviation: mappedLocation.abbreviation?.toString()?.substring(0, 20),
        address: mappedLocation.address?.toString()?.substring(0, 50),
        managerName: mappedLocation.managerName?.toString()?.substring(0, 30),
        phone: mappedLocation.phone?.toString()?.substring(0, 20),
        ownershipType: mappedLocation.ownershipType?.toString()?.substring(0, 15)
      });

      // Validate required fields
      const validationResult = LocationDataValidator.validateLocationData(mappedLocation, row, rowNum);
      if (!validationResult.isValid) {
        errors.push(...validationResult.errors);
        continue;
      }

      try {
        console.log(`💾 Inserting location ${rowNum} into database...`);
        
        const locationData = LocationDataValidator.normalizeLocationData(mappedLocation);

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
            errors.push(`Row ${rowNum}: Location with abbreviation "${mappedLocation.abbreviation}" already exists`);
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

  return {
    sampleData,
    requiredFields,
    fieldDescriptions,
    handleImport
  };
};
