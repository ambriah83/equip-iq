
-- Create location_billing table to store payment methods for each location
CREATE TABLE public.location_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_payment_method_id TEXT,
  card_last_four TEXT,
  card_brand TEXT,
  billing_name TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(location_id)
);

-- Enable RLS on location_billing table
ALTER TABLE public.location_billing ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for location_billing
CREATE POLICY "Users can view location billing for accessible locations" 
ON public.location_billing 
FOR SELECT 
USING (
  location_id IN (
    SELECT location_id FROM public.user_location_access 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update location billing for accessible locations" 
ON public.location_billing 
FOR UPDATE 
USING (
  location_id IN (
    SELECT location_id FROM public.user_location_access 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert location billing for accessible locations" 
ON public.location_billing 
FOR INSERT 
WITH CHECK (
  location_id IN (
    SELECT location_id FROM public.user_location_access 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "System can manage location billing" 
ON public.location_billing 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add trigger to auto-update updated_at
CREATE TRIGGER update_location_billing_updated_at 
BEFORE UPDATE ON public.location_billing 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
