export interface Vendor {
  id: string;
  equipment_type: string;
  equipment_name?: string;
  company_name: string;
  vendor_department?: string;
  contact_name?: string;
  phone?: string;
  website_email?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorWithContacts extends Vendor {
  contacts?: VendorContact[];
  primary_contact?: VendorContact;
  is_primary?: boolean;
}

export interface CreateVendorData {
  equipment_type: string;
  equipment_name?: string;
  company_name: string;
  vendor_department?: string;
  contact_name?: string;
  phone?: string;
  website_email?: string;
  notes?: string;
}

export interface UpdateVendorData extends Partial<CreateVendorData> {
  id: string;
}

export interface VendorContact {
  id: string;
  vendor_id: string;
  contact_name: string;
  email?: string;
  phone?: string;
  role?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorImportResult {
  success: boolean;
  processed: number;
  errors: string[];
}