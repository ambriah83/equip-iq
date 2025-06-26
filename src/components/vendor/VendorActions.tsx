
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Mail, Edit } from 'lucide-react';

interface Vendor {
  id: string;
  equipment_type: string;
  equipment_name?: string;
  company_name: string;
  vendor_department?: string;
  contact_name?: string;
  phone?: string;
  website_email?: string;
  notes?: string;
}

interface VendorActionsProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onCall: (vendor: Vendor) => void;
  onText: (vendor: Vendor) => void;
  onEmail: (vendor: Vendor) => void;
}

const VendorActions: React.FC<VendorActionsProps> = ({
  vendor,
  onEdit,
  onCall,
  onText,
  onEmail
}) => {
  return (
    <div className="flex gap-1">
      {vendor.phone && (
        <>
          <Button size="sm" variant="ghost" onClick={() => onCall(vendor)}>
            <Phone size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onText(vendor)}>
            <MessageSquare size={16} />
          </Button>
        </>
      )}
      {vendor.website_email && (
        <Button size="sm" variant="ghost" onClick={() => onEmail(vendor)}>
          <Mail size={16} />
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={() => onEdit(vendor)}>
        <Edit size={16} />
      </Button>
    </div>
  );
};

export default VendorActions;
