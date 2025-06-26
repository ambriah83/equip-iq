
export interface Equipment {
  id: string;
  name: string;
  equipment_type_id: string;
  location_id: string;
  room_id: string | null;
  serial_number: string | null;
  status: 'active' | 'maintenance' | 'offline';
  tmax_connection: 'Wired' | 'Wireless' | null;
  warranty_status: 'active' | 'inactive';
  warranty_expiry_date: string | null;
  last_service_date: string | null;
  equipment_photo_url: string | null;
  room_layout_url: string | null;
  room_photo_url: string | null;
  created_at: string;
  updated_at: string;
}
