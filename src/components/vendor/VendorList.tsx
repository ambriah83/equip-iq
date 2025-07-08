
import React from 'react';
import { Package, Phone, MessageSquare, Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/shared';
import VendorActions from './VendorActions';
import { VendorWithContacts } from '@/types/Vendor';

interface VendorListProps {
  vendors: VendorWithContacts[];
  view: 'card' | 'list';
  onEdit: (vendor: VendorWithContacts) => void;
  onCall: (vendor: VendorWithContacts) => void;
  onText: (vendor: VendorWithContacts) => void;
  onEmail: (vendor: VendorWithContacts) => void;
}

const VendorList: React.FC<VendorListProps> = ({
  vendors,
  view,
  onEdit,
  onCall,
  onText,
  onEmail
}) => {
  const columns = [
    {
      key: 'company_name',
      label: 'Company',
      render: (vendor: VendorWithContacts) => (
        <div className="font-medium">{vendor.company_name}</div>
      )
    },
    {
      key: 'equipment_type',
      label: 'Equipment Type',
      render: (vendor: VendorWithContacts) => (
        <Badge variant="outline">{vendor.equipment_type}</Badge>
      )
    },
    {
      key: 'equipment_name',
      label: 'Equipment Name'
    },
    {
      key: 'contact_name',
      label: 'Contact'
    },
    {
      key: 'phone',
      label: 'Phone'
    },
    {
      key: 'website_email',
      label: 'Email/Website'
    },
    {
      key: 'vendor_department',
      label: 'Department'
    }
  ];

  const renderActions = (vendor: VendorWithContacts) => (
    <VendorActions
      vendor={vendor}
      onEdit={onEdit}
      onCall={onCall}
      onText={onText}
      onEmail={onEmail}
    />
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <div key={vendor.id} className="bg-white rounded-lg border p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{vendor.company_name}</h3>
              <Badge variant="outline" className="mt-1">{vendor.equipment_type}</Badge>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onEdit(vendor)}>
              <Edit size={16} />
            </Button>
          </div>
          
          {vendor.equipment_name && (
            <p className="text-sm text-gray-600">{vendor.equipment_name}</p>
          )}
          
          {vendor.contact_name && (
            <p className="text-sm"><strong>Contact:</strong> {vendor.contact_name}</p>
          )}
          
          {vendor.vendor_department && (
            <p className="text-sm"><strong>Department:</strong> {vendor.vendor_department}</p>
          )}
          
          <div className="flex gap-2 pt-2">
            {vendor.phone && (
              <>
                <Button size="sm" variant="outline" onClick={() => onCall(vendor)}>
                  <Phone size={14} className="mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline" onClick={() => onText(vendor)}>
                  <MessageSquare size={14} className="mr-1" />
                  Text
                </Button>
              </>
            )}
            {vendor.website_email && (
              <Button size="sm" variant="outline" onClick={() => onEmail(vendor)}>
                <Mail size={14} className="mr-1" />
                Email
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  if (vendors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 mb-2">
          <Package size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-slate-600 mb-2">No vendors found</h3>
        <p className="text-slate-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return view === 'card' ? renderCardView() : (
    <DataTable
      data={vendors}
      columns={columns}
      onEdit={onEdit}
      actions={renderActions}
    />
  );
};

export default VendorList;
