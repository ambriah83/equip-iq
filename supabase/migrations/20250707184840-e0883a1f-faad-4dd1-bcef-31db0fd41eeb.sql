-- Create property_management table for tracking landlord/lease information
CREATE TABLE public.property_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  property_manager_name TEXT,
  property_manager_phone TEXT,
  property_manager_email TEXT,
  lease_start_date DATE,
  lease_end_date DATE,
  monthly_rent NUMERIC(10,2),
  escalation_contact TEXT,
  lease_terms_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.property_management ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for property_management table
CREATE POLICY "Users can view property management for their locations" 
ON public.property_management 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_location_access 
  WHERE user_id = auth.uid() 
  AND location_id = property_management.location_id
));

CREATE POLICY "Users can manage property info at locations they have write access" 
ON public.property_management 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_location_access 
  WHERE user_id = auth.uid() 
  AND location_id = property_management.location_id 
  AND access_level = ANY(ARRAY['write', 'admin'])
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_property_management_updated_at
  BEFORE UPDATE ON public.property_management
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_property_management_location_id ON public.property_management(location_id);
CREATE INDEX idx_property_management_lease_end ON public.property_management(lease_end_date);
CREATE INDEX idx_property_management_created_at ON public.property_management(created_at);

-- Add unique constraint to ensure one property management record per location
CREATE UNIQUE INDEX idx_property_management_location_unique ON public.property_management(location_id);