-- Create vendor_contacts table for managing multiple contacts per vendor
CREATE TABLE public.vendor_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vendor_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendor_contacts table
CREATE POLICY "Authenticated users can manage vendor contacts" 
ON public.vendor_contacts 
FOR ALL 
TO authenticated 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vendor_contacts_updated_at
  BEFORE UPDATE ON public.vendor_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_vendor_contacts_vendor_id ON public.vendor_contacts(vendor_id);
CREATE INDEX idx_vendor_contacts_is_primary ON public.vendor_contacts(is_primary);
CREATE INDEX idx_vendor_contacts_created_at ON public.vendor_contacts(created_at);