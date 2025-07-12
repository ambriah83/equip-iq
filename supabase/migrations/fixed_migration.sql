-- Fixed Security Updates Migration
-- This addresses the enum constraint issue with permissions

-- ================================================================
-- PART 1: Rate Limiting Table
-- ================================================================

-- Create table for Edge Function rate limiting
CREATE TABLE IF NOT EXISTS edge_function_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
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
-- PART 2: User Invitations Table (Simplified)
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
  accepted_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.user_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.user_invitations(status);

-- Enable RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Service role can manage invitations"
  ON public.user_invitations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ================================================================
-- PART 3: Essential Functions Only
-- ================================================================

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

-- ================================================================
-- PART 4: Final Message
-- ================================================================

DO $$
BEGIN
  RAISE NOTICE '====================================';
  RAISE NOTICE 'BASIC MIGRATION COMPLETED!';
  RAISE NOTICE '====================================';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '- edge_function_rate_limits table';
  RAISE NOTICE '- user_invitations table';
  RAISE NOTICE '- cleanup functions';
  RAISE NOTICE '';
  RAISE NOTICE 'Next: Check your user_permissions table';
  RAISE NOTICE 'to see what permission values are allowed';
  RAISE NOTICE '====================================';
END $$;