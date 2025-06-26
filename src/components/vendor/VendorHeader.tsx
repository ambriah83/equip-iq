
import React from 'react';
import { Package, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ViewToggle from '../ViewToggle';
import AddVendorDialog from '../AddVendorDialog';

interface VendorHeaderProps {
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
  onShowImportDialog: () => void;
  onAddVendor: (vendor: any) => void;
}

const VendorHeader: React.FC<VendorHeaderProps> = ({
  view,
  onViewChange,
  onShowImportDialog,
  onAddVendor
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={24} />
          <div>
            <h2 className="text-xl font-bold">Vendor Management</h2>
            <p className="text-blue-100">Manage supplier relationships and vendor information</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={onViewChange} />
          <Button onClick={onShowImportDialog} variant="secondary">
            <Upload size={16} className="mr-2" />
            Import Vendors
          </Button>
          <AddVendorDialog onAddVendor={onAddVendor} />
        </div>
      </div>
    </div>
  );
};

export default VendorHeader;
