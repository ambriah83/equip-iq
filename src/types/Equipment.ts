
export interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  room: string;
  serialNumber: string;
  status: 'active' | 'maintenance' | 'offline';
  lastService: string;
  warranty: {
    status: 'active' | 'inactive';
    expiryDate?: string;
    documentation?: string[];
  };
  tmaxConnection?: 'Wired' | 'Wireless';
  equipmentPhoto?: string;
  documentation?: string[];
  roomLayout?: string;
  roomPhoto?: string;
}
