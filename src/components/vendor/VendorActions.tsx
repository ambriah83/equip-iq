
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Mail, Edit } from 'lucide-react';
import { VendorWithContacts } from '@/types/Vendor';

interface VendorActionsProps {
  vendor: VendorWithContacts;
  onEdit: (vendor: VendorWithContacts) => void;
  onCall: (vendor: VendorWithContacts) => void;
  onText: (vendor: VendorWithContacts) => void;
  onEmail: (vendor: VendorWithContacts) => void;
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
