
-- Add corporate/franchise distinction to locations table
ALTER TABLE public.locations 
ADD COLUMN ownership_type TEXT NOT NULL DEFAULT 'franchise' CHECK (ownership_type IN ('corporate', 'franchise'));

-- Add owner information to locations
ALTER TABLE public.locations 
ADD COLUMN owner_id UUID REFERENCES auth.users(id);

-- Create a table to track owner billing information
CREATE TABLE public.owner_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  stripe_customer_id TEXT,
  subscription_active BOOLEAN DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  billing_email TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_id)
);

-- Enable RLS on owner_billing table
ALTER TABLE public.owner_billing ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for owner_billing
CREATE POLICY "Users can view their own billing info" 
ON public.owner_billing 
FOR SELECT 
USING (owner_id = auth.uid());

CREATE POLICY "Users can update their own billing info" 
ON public.owner_billing 
FOR UPDATE 
USING (owner_id = auth.uid());

CREATE POLICY "System can insert billing info" 
ON public.owner_billing 
FOR INSERT 
WITH CHECK (true);

-- Add trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_owner_billing_updated_at 
BEFORE UPDATE ON public.owner_billing 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
