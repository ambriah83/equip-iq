
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
    const errors: string[] = [];
    let processed = 0;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Account for header row

      // Validate required fields
      if (!row.name?.trim()) {
        errors.push(`Row ${rowNum}: Name is required`);
        continue;
      }

      if (!row.abbreviation?.trim()) {
        errors.push(`Row ${rowNum}: Abbreviation is required`);
        continue;
      }

      if (!row.address?.trim()) {
        errors.push(`Row ${rowNum}: Address is required`);
        continue;
      }

      // Validate status if provided
      if (row.status && !['active', 'maintenance', 'closed'].includes(row.status.toLowerCase())) {
        errors.push(`Row ${rowNum}: Invalid status. Must be 'active', 'maintenance', or 'closed'`);
        continue;
      }

      try {
        // Insert into Supabase
        const { error } = await supabase
          .from('locations')
          .insert({
            name: row.name.trim(),
            abbreviation: row.abbreviation.trim(),
            address: row.address.trim(),
            manager_name: row.manager_name?.trim() || null,
            phone: row.phone?.trim() || null,
            email: row.email?.trim() || null,
            status: row.status?.toLowerCase() || 'active',
            notes: row.notes?.trim() || null
          });

        if (error) {
          if (error.code === '23505') { // Unique constraint violation
            errors.push(`Row ${rowNum}: Location with this abbreviation already exists`);
          } else {
            errors.push(`Row ${rowNum}: Database error - ${error.message}`);
          }
          continue;
        }

        processed++;
      } catch (error) {
        errors.push(`Row ${rowNum}: Unexpected error occurred`);
      }
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
