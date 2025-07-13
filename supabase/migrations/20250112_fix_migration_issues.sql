-- Fix migration issues and discrepancies

-- 1. Remove the invalid RLS policy on the view (RLS cannot be applied to views)
-- This will fail silently if the policy doesn't exist
DROP POLICY IF EXISTS "Users can view own access summary" ON public.user_access_summary;

-- 2. Ensure user_permissions table exists before it's referenced
-- This handles the case where migrations might run out of order
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  is_allowed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT unique_user_permission UNIQUE (user_id, permission)
);

-- 3. Enable RLS on user_permissions if not already enabled
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for user_permissions if they don't exist
DO $$
BEGIN
  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_permissions' 
    AND policyname = 'Users can view own permissions'
  ) THEN
    CREATE POLICY "Users can view own permissions"
      ON public.user_permissions
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_permissions' 
    AND policyname = 'Super admins can manage all permissions'
  ) THEN
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
  END IF;
END $$;

-- 5. Add index on edge_function_rate_limits for cleanup operations
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at 
  ON public.edge_function_rate_limits(created_at);

-- 6. Create a function to automatically clean up old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.edge_function_rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create a scheduled job to clean up rate limits (if pg_cron is available)
-- Uncomment these lines if you have pg_cron extension enabled
-- SELECT cron.schedule(
--   'cleanup-rate-limits',
--   '0 * * * *', -- Every hour
--   'SELECT public.cleanup_old_rate_limits();'
-- );

-- 8. Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id 
  ON public.user_permissions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_permissions_permission 
  ON public.user_permissions(permission) 
  WHERE is_allowed = true;

-- 9. Add a helper function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION public.user_has_permission(
  check_user_id UUID,
  check_permission TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_permissions
    WHERE user_id = check_user_id
    AND permission = check_permission
    AND is_allowed = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 10. Fix the user_access_summary view to handle the RLS properly
-- by creating a function instead
CREATE OR REPLACE FUNCTION public.get_user_access_summary(target_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  accessible_locations TEXT[],
  permissions TEXT[]
) AS $$
BEGIN
  -- If no user specified, use current user
  IF target_user_id IS NULL THEN
    target_user_id := auth.uid();
  END IF;
  
  -- Only allow users to see their own data unless they're super admin
  IF target_user_id != auth.uid() AND NOT public.user_has_permission(auth.uid(), 'super_admin') THEN
    RETURN; -- Return empty result
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::TEXT,
    COALESCE(u.raw_user_meta_data->>'full_name', '')::TEXT as full_name,
    COALESCE(u.raw_user_meta_data->>'avatar_url', '')::TEXT as avatar_url,
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
  WHERE u.id = target_user_id
  GROUP BY u.id, u.email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_access_summary(UUID) TO authenticated;

-- Add comment to document the function
COMMENT ON FUNCTION public.get_user_access_summary(UUID) IS 
'Get user access summary including locations and permissions. Users can only see their own data unless they are super admin.';

-- 11. Ensure all foreign key constraints have proper indexes
CREATE INDEX IF NOT EXISTS idx_equipment_location_id ON public.equipment(location_id);
CREATE INDEX IF NOT EXISTS idx_equipment_room_id ON public.equipment(room_id);
CREATE INDEX IF NOT EXISTS idx_equipment_type_id ON public.equipment(equipment_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_location_id ON public.rooms(location_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_equipment_id ON public.knowledge_base(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_logs_equipment_id ON public.equipment_logs(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_logs_logged_by ON public.equipment_logs(logged_by);
CREATE INDEX IF NOT EXISTS idx_user_location_access_user_id ON public.user_location_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_location_access_location_id ON public.user_location_access(location_id);

-- 12. Add a note about the super admin setup
DO $$
BEGIN
  RAISE NOTICE 'IMPORTANT: Remember to grant super_admin permission to at least one user:';
  RAISE NOTICE 'INSERT INTO public.user_permissions (user_id, permission) VALUES (''<USER_ID>'', ''super_admin'');';
END $$;