
-- Create vendors table to store vendor information
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_type TEXT NOT NULL,
  equipment_name TEXT,
  company_name TEXT NOT NULL,
  vendor_department TEXT,
  contact_name TEXT,
  phone TEXT,
  website_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage vendors
CREATE POLICY "Authenticated users can manage vendors" 
  ON public.vendors 
  FOR ALL 
  TO authenticated 
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
