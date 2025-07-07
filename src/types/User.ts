
// New database-aligned User interface
export interface User {
  id: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Legacy interface - keep for backward compatibility with existing components
export interface LegacyUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'manager' | 'franchisee' | 'tech' | 'employee';
  status: 'active' | 'inactive';
}

// User with extended profile information
export interface UserWithProfile extends User {
  first_name?: string;
  last_name?: string;
  company?: string;
  position?: string;
  full_name?: string;
}

// For creating new users (typically handled by auth trigger)
export interface CreateUserData {
  id: string;
  email: string;
  phone?: string;
}

// For updating user information
export interface UpdateUserData {
  email?: string;
  phone?: string;
  is_active?: boolean;
}

// Combined user data for admin views
export interface UserDetails extends UserWithProfile {
  role?: string;
  location_access?: Array<{
    location_id: string;
    location_name: string;
    access_level: string;
  }>;
}
