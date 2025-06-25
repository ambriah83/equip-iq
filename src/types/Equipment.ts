
export interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  locationId: string;
  roomId: string;
  serialNumber: string;
  status: 'active' | 'maintenance' | 'offline';
  lastService: string;
  warranty: string;
  tmaxConnection?: 'Wired' | 'Wireless';
  equipmentPhoto?: string;
  documentation?: string[];
  warrantyDocumentation?: string[];
  roomLayout?: string;
  roomPhoto?: string;
}
