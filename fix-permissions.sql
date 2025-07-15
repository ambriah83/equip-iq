-- Emergency fix for infinite recursion in user_permissions policies
-- This script fixes the circular dependency in RLS policies

-- First, temporarily disable RLS on user_permissions to break the cycle
ALTER TABLE public.user_permissions DISABLE ROW LEVEL SECURITY;

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view own permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Super admins can manage all permissions" ON public.user_permissions;

-- Create simpler, safer policies
CREATE POLICY "authenticated_users_can_view_own_permissions"
  ON public.user_permissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Allow service role to manage all permissions (for admin functions)
CREATE POLICY "service_role_can_manage_permissions"
  ON public.user_permissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Re-enable RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Also fix the location policies to avoid the recursive call
ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;

-- Drop and recreate location policies more safely
DROP POLICY IF EXISTS "Admins can manage all locations" ON public.locations;
DROP POLICY IF EXISTS "Users can view locations they have access to" ON public.locations;

-- Simpler location policy that doesn't use the problematic user_has_permission function
CREATE POLICY "users_can_view_accessible_locations"
  ON public.locations
  FOR SELECT
  TO authenticated
  USING (
    -- Either user has explicit access
    EXISTS (
      SELECT 1 FROM public.user_location_access 
      WHERE user_id = auth.uid() AND location_id = locations.id
    )
    -- OR user has super_admin permission (direct check, no function)
    OR EXISTS (
      SELECT 1 FROM public.user_permissions
      WHERE user_id = auth.uid() 
      AND permission = 'super_admin' 
      AND is_allowed = true
    )
  );

-- Policy for managing locations
CREATE POLICY "admins_can_manage_locations"
  ON public.locations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions
      WHERE user_id = auth.uid() 
      AND permission IN ('super_admin', 'can_access_restricted_areas')
      AND is_allowed = true
    )
  );

-- Re-enable RLS for locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Grant the current user super admin permissions
-- Note: Replace 'YOUR_USER_ID' with the actual user ID from the debug component
-- INSERT INTO public.user_permissions (user_id, permission, is_allowed)
-- VALUES ('YOUR_USER_ID', 'super_admin', true)
-- ON CONFLICT (user_id, permission) DO UPDATE SET is_allowed = true;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PERMISSIONS FIXED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'The infinite recursion has been resolved.';
  RAISE NOTICE 'You can now use the debug component safely.';
  RAISE NOTICE 'Click "Grant Super Admin" to see all locations.';
  RAISE NOTICE '========================================';
END $$;