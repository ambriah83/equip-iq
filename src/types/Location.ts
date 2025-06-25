
export interface Location {
  id: string;
  name: string;
  address: string;
  manager: string;
  equipmentCount: number;
  activeIssues: number;
  status: 'active' | 'maintenance' | 'closed';
  lastUpdated: string;
  abbreviation: string;
  floorPlan?: string;
  phone?: string;
  email?: string;
  notes?: string;
}
