export interface PropertyManagement {
  id: string;
  location_id: string;
  property_manager_name: string | null;
  property_manager_phone: string | null;
  property_manager_email: string | null;
  lease_start_date: string | null;
  lease_end_date: string | null;
  monthly_rent: number | null;
  escalation_contact: string | null;
  lease_terms_url: string | null;
  created_at: string;
  updated_at: string;
}

// Property management with location information
export interface PropertyManagementWithLocation extends PropertyManagement {
  location_name?: string;
  location_abbreviation?: string;
}

// For creating new property management records
export interface CreatePropertyManagementData {
  location_id: string;
  property_manager_name?: string;
  property_manager_phone?: string;
  property_manager_email?: string;
  lease_start_date?: string;
  lease_end_date?: string;
  monthly_rent?: number;
  escalation_contact?: string;
  lease_terms_url?: string;
}

// For updating property management records
export interface UpdatePropertyManagementData {
  property_manager_name?: string;
  property_manager_phone?: string;
  property_manager_email?: string;
  lease_start_date?: string;
  lease_end_date?: string;
  monthly_rent?: number;
  escalation_contact?: string;
  lease_terms_url?: string;
}

// Property summary for dashboard views
export interface PropertySummary {
  location_id: string;
  location_name: string;
  property_manager_name?: string;
  lease_end_date?: string;
  monthly_rent?: number;
  is_lease_expiring_soon?: boolean;
}