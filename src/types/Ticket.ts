export interface Ticket {
  id: string;
  location_id: string;
  equipment_id: string | null;
  room_id: string | null;
  ticket_type: 'maintenance' | 'vendor' | 'inspection' | 'other';
  status: 'open' | 'in_progress' | 'on_hold' | 'closed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string | null;
  reported_by_user_id: string;
  assigned_to_user_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

// Ticket with related data for display
export interface TicketWithDetails extends Ticket {
  location_name?: string;
  equipment_name?: string;
  room_name?: string;
  reported_by_name?: string;
  assigned_to_name?: string;
  comment_count?: number;
}

// For creating new tickets
export interface CreateTicketData {
  location_id: string;
  equipment_id?: string;
  room_id?: string;
  ticket_type: 'maintenance' | 'vendor' | 'inspection' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description?: string;
  assigned_to_user_id?: string;
}

// For updating tickets
export interface UpdateTicketData {
  ticket_type?: 'maintenance' | 'vendor' | 'inspection' | 'other';
  status?: 'open' | 'in_progress' | 'on_hold' | 'closed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  title?: string;
  description?: string;
  assigned_to_user_id?: string;
  resolved_at?: string;
}