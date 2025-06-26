
import React from 'react';
import CSVImportDialog from '@/components/shared/CSVImportDialog';

interface UserImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUsersImported: () => void;
}

const UserImportDialog: React.FC<UserImportDialogProps> = ({
  isOpen,
  onClose,
  onUsersImported
}) => {
  const sampleData = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'staff',
    status: 'active'
  };

  const requiredFields = ['name', 'email', 'role'];

  const fieldDescriptions = {
    name: 'Full name of the user',
    email: 'Valid email address (must be unique)',
    role: 'User role: owner, admin, manager, staff, or vendor',
    status: 'User status: active or inactive (optional, defaults to active)'
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

      if (!row.email?.trim()) {
        errors.push(`Row ${rowNum}: Email is required`);
        continue;
      }

      if (!row.role?.trim()) {
        errors.push(`Row ${rowNum}: Role is required`);
        continue;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        errors.push(`Row ${rowNum}: Invalid email format`);
        continue;
      }

      // Validate role
      const validRoles = ['owner', 'admin', 'manager', 'staff', 'vendor'];
      if (!validRoles.includes(row.role.toLowerCase())) {
        errors.push(`Row ${rowNum}: Invalid role. Must be one of: ${validRoles.join(', ')}`);
        continue;
      }

      // Validate status if provided
      if (row.status && !['active', 'inactive'].includes(row.status.toLowerCase())) {
        errors.push(`Row ${rowNum}: Invalid status. Must be 'active' or 'inactive'`);
        continue;
      }

      // Here you would typically save to database
      // For now, just count as processed
      processed++;
    }

    // Trigger refresh of user list
    if (processed > 0) {
      onUsersImported();
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
      title="Users"
      onImport={handleImport}
      sampleData={sampleData}
      requiredFields={requiredFields}
      fieldDescriptions={fieldDescriptions}
    />
  );
};

export default UserImportDialog;
