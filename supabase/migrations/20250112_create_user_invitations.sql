-- Create user_invitations table for the send-invitation Edge Function

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

-- Create indexes for efficient querying
CREATE INDEX idx_invitations_email ON public.user_invitations(email);
CREATE INDEX idx_invitations_token ON public.user_invitations(invitation_token);
CREATE INDEX idx_invitations_status ON public.user_invitations(status);
CREATE INDEX idx_invitations_expires ON public.user_invitations(expires_at) WHERE status = 'pending';

-- Enable RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Only authenticated users can view invitations they sent
CREATE POLICY "Users can view invitations they sent"
  ON public.user_invitations
  FOR SELECT
  USING (invited_by = auth.uid());

-- Super admins can view all invitations
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

-- Location admins can view invitations for their locations
CREATE POLICY "Location admins can view invitations for their locations"
  ON public.user_invitations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_location_access
      WHERE user_id = auth.uid()
      AND access_level = 'admin'
      AND location_id = ANY(
        SELECT unnest(location_access)::UUID 
        FROM public.user_invitations ui 
        WHERE ui.id = user_invitations.id
      )
    )
  );

-- Only allow inserts through the Edge Function (service role)
CREATE POLICY "Service role can manage invitations"
  ON public.user_invitations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to automatically expire old invitations
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

-- Function to handle invitation acceptance
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
      'read' -- Default to read access, can be upgraded later
    FROM unnest(v_invitation.location_access) AS location_id
    ON CONFLICT (user_id, location_id) DO NOTHING;
  END IF;
  
  -- Set user role if needed (you might want to implement this differently)
  -- For now, we'll store it in user_permissions
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.accept_invitation(UUID, UUID) TO authenticated;

-- Add helpful comments
COMMENT ON TABLE public.user_invitations IS 'Stores user invitations sent via the send-invitation Edge Function';
COMMENT ON COLUMN public.user_invitations.location_access IS 'Array of location IDs the invited user should have access to';
COMMENT ON FUNCTION public.accept_invitation(UUID, UUID) IS 'Accept a user invitation and grant appropriate access';

-- Trigger to enforce unique pending invitation constraint properly
CREATE OR REPLACE FUNCTION public.enforce_unique_pending_invitation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' THEN
    -- Cancel any existing pending invitations for this email
    UPDATE public.user_invitations
    SET status = 'cancelled'
    WHERE email = NEW.email
    AND status = 'pending'
    AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_unique_pending_invitation_trigger
  BEFORE INSERT ON public.user_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_unique_pending_invitation();