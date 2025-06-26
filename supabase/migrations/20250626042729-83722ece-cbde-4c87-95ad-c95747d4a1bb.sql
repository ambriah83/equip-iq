
-- Create locations table
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL UNIQUE,
  address TEXT,
  manager_name TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create equipment_types table for standardized equipment types
CREATE TABLE public.equipment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rooms table for better normalization
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  floor_number INTEGER,
  capacity INTEGER,
  room_type TEXT CHECK (room_type IN ('tanning', 'spray', 'spa', 'red_light', 'utility', 'other')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (location_id, name)
);

-- Create equipment table
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  equipment_type_id UUID NOT NULL REFERENCES public.equipment_types(id),
  location_id UUID NOT NULL REFERENCES public.locations(id),
  room_id UUID REFERENCES public.rooms(id),
  serial_number TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'offline')),
  tmax_connection TEXT CHECK (tmax_connection IN ('Wired', 'Wireless')),
  warranty_status TEXT NOT NULL DEFAULT 'inactive' CHECK (warranty_status IN ('active', 'inactive')),
  warranty_expiry_date DATE,
  last_service_date DATE,
  equipment_photo_url TEXT,
  room_layout_url TEXT,
  room_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create knowledge_base table for equipment documentation
CREATE TABLE public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  document_type TEXT NOT NULL CHECK (document_type IN ('manual', 'maintenance_guide', 'warranty', 'troubleshooting', 'other')),
  file_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create equipment_logs table for maintenance/service history
CREATE TABLE public.equipment_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL CHECK (log_type IN ('maintenance', 'repair', 'inspection', 'cleaning', 'installation', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  performed_by UUID,
  cost DECIMAL(10,2),
  parts_used TEXT[],
  next_service_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_location_access table for user access control
CREATE TABLE public.user_location_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  location_id UUID NOT NULL REFERENCES public.locations(id),
  access_level TEXT NOT NULL DEFAULT 'read' CHECK (access_level IN ('read', 'write', 'admin')),
  granted_by UUID DEFAULT auth.uid(),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, location_id)
);

-- Create the updated_at function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at columns
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_user_permissions_updated_at
  BEFORE UPDATE ON public.user_permissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Insert default equipment types
INSERT INTO public.equipment_types (name, description) VALUES
  ('Sun', 'Tanning beds and sun equipment'),
  ('Spray', 'Spray tanning equipment'),
  ('Spa', 'Spa and wellness equipment'),
  ('Red Light', 'Red light therapy equipment'),
  ('HVAC', 'Heating, ventilation, and air conditioning'),
  ('Washer', 'Washing machines'),
  ('Dryer', 'Drying machines'),
  ('Other', 'Miscellaneous equipment');

-- Enable Row Level Security
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_location_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for locations
CREATE POLICY "Users can view locations they have access to" 
  ON public.locations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_location_access 
      WHERE user_id = auth.uid() AND location_id = locations.id
    )
  );

CREATE POLICY "Admins can manage all locations" 
  ON public.locations 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND permission = 'can_access_restricted_areas' AND is_allowed = true
    )
  );

-- RLS Policies for equipment_types (read-only for authenticated users)
CREATE POLICY "Authenticated users can view equipment types" 
  ON public.equipment_types 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- RLS Policies for equipment
CREATE POLICY "Users can view equipment at their locations" 
  ON public.equipment 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_location_access 
      WHERE user_id = auth.uid() AND location_id = equipment.location_id
    )
  );

CREATE POLICY "Users can manage equipment at locations they have write access to" 
  ON public.equipment 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_location_access 
      WHERE user_id = auth.uid() AND location_id = equipment.location_id 
      AND access_level IN ('write', 'admin')
    )
  );

-- RLS Policies for rooms
CREATE POLICY "Users can view rooms at their locations" 
  ON public.rooms 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_location_access 
      WHERE user_id = auth.uid() AND location_id = rooms.location_id
    )
  );

CREATE POLICY "Users can manage rooms at locations they have write access to" 
  ON public.rooms 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_location_access 
      WHERE user_id = auth.uid() AND location_id = rooms.location_id 
      AND access_level IN ('write', 'admin')
    )
  );

-- RLS Policies for knowledge_base
CREATE POLICY "Users can view knowledge for equipment they can access" 
  ON public.knowledge_base 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment e
      JOIN public.user_location_access ula ON ula.location_id = e.location_id
      WHERE e.id = knowledge_base.equipment_id AND ula.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage knowledge for equipment they have write access to" 
  ON public.knowledge_base 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment e
      JOIN public.user_location_access ula ON ula.location_id = e.location_id
      WHERE e.id = knowledge_base.equipment_id AND ula.user_id = auth.uid()
      AND ula.access_level IN ('write', 'admin')
    )
  );

-- RLS Policies for equipment_logs
CREATE POLICY "Users can view equipment logs for equipment they can access" 
  ON public.equipment_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment e
      JOIN public.user_location_access ula ON ula.location_id = e.location_id
      WHERE e.id = equipment_logs.equipment_id AND ula.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage equipment logs for equipment they have write access to" 
  ON public.equipment_logs 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.equipment e
      JOIN public.user_location_access ula ON ula.location_id = e.location_id
      WHERE e.id = equipment_logs.equipment_id AND ula.user_id = auth.uid()
      AND ula.access_level IN ('write', 'admin')
    )
  );

-- RLS Policies for user_location_access
CREATE POLICY "Users can view their own location access" 
  ON public.user_location_access 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all location access" 
  ON public.user_location_access 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND permission = 'can_access_restricted_areas' AND is_allowed = true
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_equipment_location_id ON public.equipment(location_id);
CREATE INDEX idx_equipment_type_id ON public.equipment(equipment_type_id);
CREATE INDEX idx_equipment_room_id ON public.equipment(room_id);
CREATE INDEX idx_knowledge_base_equipment_id ON public.knowledge_base(equipment_id);
CREATE INDEX idx_equipment_logs_equipment_id ON public.equipment_logs(equipment_id);
CREATE INDEX idx_user_location_access_user_id ON public.user_location_access(user_id);
CREATE INDEX idx_user_location_access_location_id ON public.user_location_access(location_id);
CREATE INDEX idx_rooms_location_id ON public.rooms(location_id);

-- Add comment for future reference
COMMENT ON COLUMN public.user_location_access.granted_by IS 'Should reference the user who granted access - consider making NOT NULL in production';
