import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Phone, Mail, Edit, Trash2, Star } from 'lucide-react';
import { useVendorContacts } from '@/hooks/useVendorContacts';
import { VendorContact } from '@/types/VendorContact';
import { VendorContactDialog } from './VendorContactDialog';

interface VendorContactsSectionProps {
  vendorId: string;
}

export const VendorContactsSection: React.FC<VendorContactsSectionProps> = ({ vendorId }) => {
  const { contacts, loading, loadContactsForVendor, deleteContact, setPrimaryContact } = useVendorContacts();
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<VendorContact | null>(null);

  useEffect(() => {
    if (vendorId) {
      loadContactsForVendor(vendorId);
    }
  }, [vendorId, loadContactsForVendor]);

  const handleEdit = (contact: VendorContact) => {
    setEditingContact(contact);
    setShowContactDialog(true);
  };

  const handleDelete = async (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact(contactId);
    }
  };

  const handleCall = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`);
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`);
    }
  };

  const closeDialog = () => {
    setShowContactDialog(false);
    setEditingContact(null);
  };

  if (loading) {
    return <div>Loading contacts...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Contacts</CardTitle>
          <Button
            onClick={() => setShowContactDialog(true)}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No contacts added yet. Click "Add Contact" to get started.
          </p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{contact.contact_name}</h4>
                    {contact.is_primary && (
                      <Badge variant="default" className="gap-1">
                        <Star className="h-3 w-3" />
                        Primary
                      </Badge>
                    )}
                  </div>
                  {contact.role && (
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {!contact.is_primary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPrimaryContact(contact.id)}
                      title="Set as primary contact"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-4 text-sm">
                {contact.phone && (
                  <button
                    onClick={() => handleCall(contact.phone!)}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {contact.phone}
                  </button>
                )}
                {contact.email && (
                  <button
                    onClick={() => handleEmail(contact.email!)}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    {contact.email}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>

      <VendorContactDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        vendorId={vendorId}
        contact={editingContact}
        onClose={closeDialog}
        onSuccess={() => {
          loadContactsForVendor(vendorId);
          closeDialog();
        }}
      />
    </Card>
  );
};