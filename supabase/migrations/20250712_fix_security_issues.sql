-- FIX SECURITY ISSUES IN EQUIPIQ DATABASE
-- This migration fixes critical security issues found in the database schema

-- 1. Create the missing user_permissions table
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  is_allowed BOOLEAN NOT NULL DEFAULT false,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, permission)
);

-- 2. Enable RLS on user_permissions
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- 3. Add the missing trigger for user_permissions
CREATE TRIGGER update_user_permissions_updated_at
  BEFORE UPDATE ON public.user_permissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. Create policies for user_permissions
-- Users can only view their own permissions
CREATE POLICY "Users can view own permissions" 
  ON public.user_permissions 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Only super admins can manage permissions
CREATE POLICY "Super admins can manage all permissions" 
  ON public.user_permissions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() 
      AND permission = 'super_admin' 
      AND is_allowed = true
    )
  );

-- 5. Create initial super admin (YOU MUST UPDATE THIS WITH YOUR ACTUAL USER ID)
-- IMPORTANT: Replace 'YOUR-USER-ID-HERE' with your actual Supabase auth user ID
-- You can find this in Supabase Dashboard > Authentication > Users
/*
INSERT INTO public.user_permissions (user_id, permission, is_allowed)
VALUES 
  ('YOUR-USER-ID-HERE', 'super_admin', true),
  ('YOUR-USER-ID-HERE', 'can_access_restricted_areas', true)
ON CONFLICT (user_id, permission) DO UPDATE
SET is_allowed = EXCLUDED.is_allowed;
*/

-- 6. Create a function to check if user has permission
CREATE OR REPLACE FUNCTION public.user_has_permission(check_permission TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_permissions
    WHERE user_id = auth.uid()
    AND permission = check_permission
    AND is_allowed = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create a function to grant initial access when a user signs up
-- This ensures new users get at least one location to access
CREATE OR REPLACE FUNCTION public.handle_new_user_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Give new users access to a default location if one exists
  -- You can modify this logic based on your needs
  INSERT INTO public.user_location_access (user_id, location_id, access_level)
  SELECT 
    NEW.id,
    id,
    'read'
  FROM public.locations
  WHERE status = 'active'
  LIMIT 1
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Add trigger for new user access
CREATE TRIGGER on_auth_user_created_access
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_access();

-- 9. Fix the RLS policies to handle the case when no permissions exist
-- Update location policy to allow access if user has location access OR is super admin
DROP POLICY IF EXISTS "Admins can manage all locations" ON public.locations;
CREATE POLICY "Admins can manage all locations" 
  ON public.locations 
  FOR ALL 
  USING (
    public.user_has_permission('can_access_restricted_areas') OR
    public.user_has_permission('super_admin')
  );

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission ON public.user_permissions(permission);

-- 11. Add helpful comments
COMMENT ON TABLE public.user_permissions IS 'Stores user permissions for role-based access control';
COMMENT ON COLUMN public.user_permissions.permission IS 'Permission name like super_admin, can_access_restricted_areas, etc.';
COMMENT ON COLUMN public.user_permissions.is_allowed IS 'Whether the permission is granted (true) or explicitly denied (false)';

-- 12. Create a view to easily see user access
CREATE OR REPLACE VIEW public.user_access_summary AS
SELECT 
  u.id,
  u.email,
  COALESCE(
    ARRAY_AGG(DISTINCT l.name) FILTER (WHERE l.name IS NOT NULL),
    ARRAY[]::TEXT[]
  ) as accessible_locations,
  COALESCE(
    ARRAY_AGG(DISTINCT up.permission) FILTER (WHERE up.is_allowed = true),
    ARRAY[]::TEXT[]
  ) as permissions
FROM auth.users u
LEFT JOIN public.user_location_access ula ON ula.user_id = u.id
LEFT JOIN public.locations l ON l.id = ula.location_id
LEFT JOIN public.user_permissions up ON up.user_id = u.id
GROUP BY u.id, u.email;

-- Grant select on the view to authenticated users
GRANT SELECT ON public.user_access_summary TO authenticated;

-- 13. Add RLS policy for the view
CREATE POLICY "Users can view own access summary"
  ON public.user_access_summary
  FOR SELECT
  USING (id = auth.uid());