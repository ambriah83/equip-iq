export interface Ticket {
  id: string;
  location_id: string;
  equipment_id: string | null;
  room_id: string | null;
  ticket_type: 'maintenance' | 'vendor' | 'inspection' | 'other' | 'repair' | 'emergency' | 'cleaning';
  status: 'open' | 'in_progress' | 'on_hold' | 'closed' | 'cancelled' | 'resolved';
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
  location?: {
    id: string;
    name: string;
    abbreviation: string;
  };
  equipment?: {
    id: string;
    name: string;
  };
  room?: {
    id: string;
    name: string;
  };
  reported_by?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  assigned_to?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
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
  ticket_type: 'maintenance' | 'vendor' | 'inspection' | 'other' | 'repair' | 'emergency' | 'cleaning';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description?: string;
  assigned_to_user_id?: string;
}

// For updating tickets
export interface UpdateTicketData {
  id: string;
  ticket_type?: 'maintenance' | 'vendor' | 'inspection' | 'other' | 'repair' | 'emergency' | 'cleaning';
  status?: 'open' | 'in_progress' | 'on_hold' | 'closed' | 'cancelled' | 'resolved';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  title?: string;
  description?: string;
  assigned_to_user_id?: string;
  resolved_at?: string;
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  location_id?: string;
  equipment_id?: string;
  assigned_to_user_id?: string;
}