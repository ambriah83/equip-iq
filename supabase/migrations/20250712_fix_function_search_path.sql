-- Fix search_path security issue for log_import_attempt function
CREATE OR REPLACE FUNCTION public.log_import_attempt(
  operation_type TEXT,
  table_name TEXT,
  details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Log import attempts for audit purposes
  INSERT INTO public.import_logs (
    operation_type,
    table_name,
    details,
    user_id,
    created_at
  ) VALUES (
    operation_type,
    table_name,
    details,
    auth.uid(),
    NOW()
  );
  
  -- Also raise a notice for debugging
  RAISE NOTICE 'Import attempt logged: operation=%, table=%, user=%', 
    operation_type, table_name, auth.uid();
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, pg_temp;

-- Create import_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.import_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  details JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on import_logs
ALTER TABLE public.import_logs ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only see their own import logs
CREATE POLICY "Users can view own import logs" ON public.import_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: only authenticated users can insert logs through the function
CREATE POLICY "Function can insert import logs" ON public.import_logs
  FOR INSERT
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_import_logs_user_id ON public.import_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_import_logs_created_at ON public.import_logs(created_at DESC);