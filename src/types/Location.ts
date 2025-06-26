
export interface Location {
  id: string;
  name: string;
  abbreviation: string;
  address: string | null;
  manager_name: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  status: 'active' | 'maintenance' | 'closed';
  created_at: string;
  updated_at: string;
}
