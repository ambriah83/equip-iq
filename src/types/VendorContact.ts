export interface VendorContact {
  id: string;
  vendor_id: string;
  contact_name: string;
  role?: string;
  email?: string;
  phone?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// For creating new vendor contacts
export interface CreateVendorContactData {
  vendor_id: string;
  contact_name: string;
  role?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
}

// For updating vendor contacts
export interface UpdateVendorContactData {
  contact_name?: string;
  role?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
}

// Vendor with contacts
export interface VendorWithContacts {
  id: string;
  equipment_type: string;
  equipment_name?: string;
  company_name: string;
  vendor_department?: string;
  contact_name?: string;
  phone?: string;
  website_email?: string;
  notes?: string;
  contacts: VendorContact[];
}

// Common contact roles
export const CONTACT_ROLES = [
  'Sales Rep',
  'Technical Support',
  'Customer Service',
  'Account Manager',
  'Service Manager',
  'Emergency Contact',
  'Billing Contact'
] as const;

export type ContactRole = typeof CONTACT_ROLES[number];