
export interface Equipment {
  id: string;
  name: string;
  serial_number: string | null;
  equipment_type_id: string;
  location_id: string;
  room_id: string | null;
  status: 'active' | 'maintenance' | 'inactive';
  warranty_status: 'active' | 'inactive';
  warranty_expiry_date: string | null;
  last_service_date: string | null;
  equipment_photo_url: string | null;
  room_photo_url: string | null;
  room_layout_url: string | null;
  created_at: string;
  updated_at: string;
}

// Equipment with related data for display
export interface EquipmentWithDetails extends Equipment {
  location_name?: string;
  room_name?: string;
  equipment_type_name?: string;
}
