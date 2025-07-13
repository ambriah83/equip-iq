-- Combined Security Updates Migration
-- This file combines all the security updates into one migration for easier deployment

-- ================================================================
-- PART 1: Rate Limiting Table
-- ================================================================

-- Create table for Edge Function rate limiting
CREATE TABLE IF NOT EXISTS edge_function_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_rate_limits_key_created ON edge_function_rate_limits(key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at ON edge_function_rate_limits(created_at);

-- Enable RLS
ALTER TABLE edge_function_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can access this table
CREATE POLICY "Service role only" ON edge_function_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ================================================================
-- PART 2: Fix Migration Issues
-- ================================================================

-- Ensure user_permissions table exists
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  is_allowed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT unique_user_permission UNIQUE (user_id, permission)
);

-- Enable RLS on user_permissions
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_permissions
DO $$
BEGIN
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_permission ON public.user_permissions(permission) WHERE is_allowed = true;

-- ================================================================
-- PART 3: User Invitations Table
-- ================================================================

CREATE TABLE IF NOT EXISTS public.user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  invitation_token UUID NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  location_access TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  
  -- Prevent duplicate pending invitations for the same email
  CONSTRAINT unique_pending_invitation UNIQUE (email, status) 
    DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.user_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.user_invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_expires ON public.user_invitations(expires_at) WHERE status = 'pending';

-- Enable RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invitations
CREATE POLICY "Users can view invitations they sent"
  ON public.user_invitations
  FOR SELECT
  USING (invited_by = auth.uid());

CREATE POLICY "Super admins can view all invitations"
  ON public.user_invitations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions
      WHERE user_id = auth.uid()
      AND permission = 'super_admin'
      AND is_allowed = true
    )
  );

CREATE POLICY "Service role can manage invitations"
  ON public.user_invitations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ================================================================
-- PART 4: Helper Functions
-- ================================================================

-- Function to check user permissions
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

-- Function to clean up old rate limits
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

-- Function to expire old invitations
CREATE OR REPLACE FUNCTION public.expire_old_invitations()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE public.user_invitations
  SET status = 'expired'
  WHERE status = 'pending'
  AND expires_at < NOW();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to accept invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(
  p_invitation_token UUID,
  p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_invitation RECORD;
  v_result JSONB;
BEGIN
  -- Get the invitation
  SELECT * INTO v_invitation
  FROM public.user_invitations
  WHERE invitation_token = p_invitation_token
  AND status = 'pending'
  AND expires_at > NOW()
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired invitation'
    );
  END IF;
  
  -- Mark invitation as accepted
  UPDATE public.user_invitations
  SET 
    status = 'accepted',
    accepted_at = NOW()
  WHERE id = v_invitation.id;
  
  -- Grant location access if specified
  IF array_length(v_invitation.location_access, 1) > 0 THEN
    INSERT INTO public.user_location_access (user_id, location_id, access_level)
    SELECT 
      p_user_id,
      location_id::UUID,
      'read' -- Default to read access
    FROM unnest(v_invitation.location_access) AS location_id
    ON CONFLICT (user_id, location_id) DO NOTHING;
  END IF;
  
  -- Set user role if needed
  IF v_invitation.role IS NOT NULL THEN
    INSERT INTO public.user_permissions (user_id, permission, created_by)
    VALUES (p_user_id, 'role:' || v_invitation.role, v_invitation.invited_by)
    ON CONFLICT (user_id, permission) DO NOTHING;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'role', v_invitation.role,
    'location_access', v_invitation.location_access
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.accept_invitation(UUID, UUID) TO authenticated;

-- ================================================================
-- PART 5: Final Setup Instructions
-- ================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'MIGRATION COMPLETED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANT NEXT STEPS:';
  RAISE NOTICE '1. Grant yourself super_admin permission:';
  RAISE NOTICE '   INSERT INTO public.user_permissions (user_id, permission)';
  RAISE NOTICE '   VALUES (''<YOUR_USER_ID>'', ''super_admin'');';
  RAISE NOTICE '';
  RAISE NOTICE '2. Update Edge Functions environment variable:';
  RAISE NOTICE '   Set ENVIRONMENT=production in Supabase Dashboard';
  RAISE NOTICE '';
  RAISE NOTICE '3. Deploy your updated Edge Functions';
  RAISE NOTICE '========================================';
END $$;