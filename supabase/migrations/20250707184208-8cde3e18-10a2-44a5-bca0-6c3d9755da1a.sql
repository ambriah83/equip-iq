-- Create tickets table for tracking work orders and issues
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE SET NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('maintenance', 'vendor', 'inspection', 'other')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'on_hold', 'closed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  title TEXT NOT NULL,
  description TEXT,
  reported_by_user_id UUID NOT NULL,
  assigned_to_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create ticket_comments table for tracking comments on tickets
CREATE TABLE public.ticket_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tickets table
CREATE POLICY "Users can view tickets at their locations" 
ON public.tickets 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_location_access 
  WHERE user_id = auth.uid() 
  AND location_id = tickets.location_id
));

CREATE POLICY "Users can manage tickets at locations they have write access" 
ON public.tickets 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_location_access 
  WHERE user_id = auth.uid() 
  AND location_id = tickets.location_id 
  AND access_level = ANY(ARRAY['write', 'admin'])
));

-- Create RLS policies for ticket_comments table
CREATE POLICY "Users can view comments for tickets they can access" 
ON public.ticket_comments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM tickets t
  JOIN user_location_access ula ON ula.location_id = t.location_id
  WHERE t.id = ticket_comments.ticket_id 
  AND ula.user_id = auth.uid()
));

CREATE POLICY "Users can manage comments for tickets they have write access" 
ON public.ticket_comments 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM tickets t
  JOIN user_location_access ula ON ula.location_id = t.location_id
  WHERE t.id = ticket_comments.ticket_id 
  AND ula.user_id = auth.uid() 
  AND ula.access_level = ANY(ARRAY['write', 'admin'])
));

-- Create trigger for automatic timestamp updates on tickets
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_tickets_location_id ON public.tickets(location_id);
CREATE INDEX idx_tickets_equipment_id ON public.tickets(equipment_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_priority ON public.tickets(priority);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at);
CREATE INDEX idx_ticket_comments_ticket_id ON public.ticket_comments(ticket_id);
CREATE INDEX idx_ticket_comments_created_at ON public.ticket_comments(created_at);