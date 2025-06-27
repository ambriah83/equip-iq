
-- Fix RLS policies for locations table to allow proper data visibility

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view locations they have access to" ON public.locations;
DROP POLICY IF EXISTS "Admins can manage all locations" ON public.locations;

-- Create more permissive policies for now to ensure data visibility
CREATE POLICY "Authenticated users can view all locations" 
  ON public.locations 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can manage locations" 
  ON public.locations 
  FOR ALL 
  TO authenticated 
  USING (true);

-- Also ensure user_location_access policies are working
DROP POLICY IF EXISTS "Users can view their own location access" ON public.user_location_access;
DROP POLICY IF EXISTS "Admins can manage all location access" ON public.user_location_access;

CREATE POLICY "Authenticated users can view location access" 
  ON public.user_location_access 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can manage location access" 
  ON public.user_location_access 
  FOR ALL 
  TO authenticated 
  USING (true);
