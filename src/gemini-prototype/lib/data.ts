export interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'Online' | 'Warning' | 'Error';
  image: string;
}

export interface Ticket {
  id: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  equipment: string;
  location: string;
  created: string;
  reporter: string;
  activityLog: string[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  equipmentCount: number;
  status: 'Online' | 'Warning' | 'Error';
}

export const MOCK_EQUIPMENT: Equipment[] = [
  { 
    id: 'EQ-001', 
    name: 'Ergoline Sunrise 7200', 
    type: 'Tanning Bed', 
    location: 'Sarasota Main St', 
    status: 'Online', 
    image: 'https://placehold.co/600x400/007AFF/FFFFFF?text=Ergoline+7200' 
  },
  { 
    id: 'EQ-002', 
    name: 'VersaSpa Pro', 
    type: 'Spray Tan Booth', 
    location: 'Sarasota Main St', 
    status: 'Online', 
    image: 'https://placehold.co/600x400/007AFF/FFFFFF?text=VersaSpa+Pro' 
  },
  { 
    id: 'EQ-003', 
    name: 'KBL Megasun 6800', 
    type: 'Tanning Bed', 
    location: 'Bradenton West', 
    status: 'Error', 
    image: 'https://placehold.co/600x400/FF3B30/FFFFFF?text=KBL+6800' 
  },
  { 
    id: 'EQ-004', 
    name: 'Ergoline Prestige 1400', 
    type: 'Tanning Bed', 
    location: 'Sarasota Main St', 
    status: 'Warning', 
    image: 'https://placehold.co/600x400/FFCC00/000000?text=Ergoline+1400' 
  },
  { 
    id: 'EQ-005', 
    name: 'Mystic Tan Kyss', 
    type: 'Spray Tan Booth', 
    location: 'Bradenton West', 
    status: 'Online', 
    image: 'https://placehold.co/600x400/007AFF/FFFFFF?text=Mystic+Tan' 
  },
];

export const MOCK_TICKETS: Ticket[] = [
  { 
    id: 'TKT-0123', 
    title: 'E52 Error Code on Bed 3', 
    status: 'Open', 
    priority: 'High', 
    equipment: 'KBL Megasun 6800', 
    location: 'Bradenton West', 
    created: '2025-07-14', 
    reporter: 'Jane Doe', 
    activityLog: [
      "User reported E52 error.", 
      "AI suggested checking canopy sensor.", 
      "User confirmed sensor is clean.", 
      "AI created this ticket for technician review."
    ] 
  },
  { 
    id: 'TKT-0122', 
    title: 'UV Lamp replacement needed', 
    status: 'In Progress', 
    priority: 'Medium', 
    equipment: 'Ergoline Prestige 1400', 
    location: 'Sarasota Main St', 
    created: '2025-07-12', 
    reporter: 'John Smith', 
    activityLog: [
      "User reported dim lamps.", 
      "AI created ticket.", 
      "Technician Mark assigned."
    ] 
  },
  { 
    id: 'TKT-0121', 
    title: 'Filter cleaning', 
    status: 'Closed', 
    priority: 'Low', 
    equipment: 'VersaSpa Pro', 
    location: 'Sarasota Main St', 
    created: '2025-07-10', 
    reporter: 'Jane Doe', 
    activityLog: [
      "Routine maintenance reminder.", 
      "Technician completed and closed."
    ] 
  },
];

export const MOCK_LOCATIONS: Location[] = [
  { 
    id: 'LOC-01', 
    name: 'Sarasota Main St', 
    address: '123 Main St, Sarasota, FL', 
    equipmentCount: 3, 
    status: 'Warning' 
  },
  { 
    id: 'LOC-02', 
    name: 'Bradenton West', 
    address: '456 Ocean Blvd, Bradenton, FL', 
    equipmentCount: 2, 
    status: 'Error' 
  },
];