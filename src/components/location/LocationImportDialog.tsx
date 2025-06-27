
import React from 'react';
import CSVImportDialog from '@/components/shared/CSVImportDialog';
import { useLocationImport } from './useLocationImport';

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
  const {
    sampleData,
    requiredFields,
    fieldDescriptions,
    handleImport
  } = useLocationImport({ onLocationsImported });

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
