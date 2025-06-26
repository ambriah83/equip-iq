
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('owner', 'admin', 'manager', 'staff', 'vendor');

-- Create enum for escalation permissions
CREATE TYPE public.escalation_permission AS ENUM (
  'can_use_ladder',
  'can_handle_electrical', 
  'can_disassemble_parts',
  'can_work_at_height',
  'can_handle_chemicals',
  'can_operate_heavy_equipment',
  'can_access_restricted_areas',
  'can_perform_emergency_shutdowns'
);

-- Create role permissions defaults table
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  permission escalation_permission NOT NULL,
  is_allowed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, permission)
);

-- Insert default permissions for each role
INSERT INTO public.role_permissions (role, permission, is_allowed) VALUES
-- Owner permissions (can do everything)
('owner', 'can_use_ladder', true),
('owner', 'can_handle_electrical', true),
('owner', 'can_disassemble_parts', true),
('owner', 'can_work_at_height', true),
('owner', 'can_handle_chemicals', true),
('owner', 'can_operate_heavy_equipment', true),
('owner', 'can_access_restricted_areas', true),
('owner', 'can_perform_emergency_shutdowns', true),

-- Admin permissions (most permissions)
('admin', 'can_use_ladder', true),
('admin', 'can_handle_electrical', true),
('admin', 'can_disassemble_parts', true),
('admin', 'can_work_at_height', true),
('admin', 'can_handle_chemicals', true),
('admin', 'can_operate_heavy_equipment', true),
('admin', 'can_access_restricted_areas', true),
('admin', 'can_perform_emergency_shutdowns', true),

-- Manager permissions (selective permissions)
('manager', 'can_use_ladder', true),
('manager', 'can_handle_electrical', false),
('manager', 'can_disassemble_parts', true),
('manager', 'can_work_at_height', true),
('manager', 'can_handle_chemicals', false),
('manager', 'can_operate_heavy_equipment', false),
('manager', 'can_access_restricted_areas', true),
('manager', 'can_perform_emergency_shutdowns', true),

-- Staff permissions (basic permissions)
('staff', 'can_use_ladder', true),
('staff', 'can_handle_electrical', true),
('staff', 'can_disassemble_parts', true),
('staff', 'can_work_at_height', false),
('staff', 'can_handle_chemicals', false),
('staff', 'can_operate_heavy_equipment', false),
('staff', 'can_access_restricted_areas', false),
('staff', 'can_perform_emergency_shutdowns', false),

-- Vendor permissions (allow basic operational tasks)
('vendor', 'can_use_ladder', true),
('vendor', 'can_handle_electrical', true),
('vendor', 'can_disassemble_parts', true),
('vendor', 'can_work_at_height', false),
('vendor', 'can_handle_chemicals', false),
('vendor', 'can_operate_heavy_equipment', false),
('vendor', 'can_access_restricted_areas', false),
('vendor', 'can_perform_emergency_shutdowns', false);

-- Create user permissions table for individual overrides
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role user_role NOT NULL,
  permission escalation_permission NOT NULL,
  is_allowed BOOLEAN NOT NULL DEFAULT false,
  custom_permissions_applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, permission)
);

-- Enable RLS on both tables
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies for role_permissions (read-only for authenticated users)
CREATE POLICY "Authenticated users can view role permissions"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_permissions
CREATE POLICY "Users can view all user permissions"
  ON public.user_permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and owner can manage user permissions"
  ON public.user_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions up
      WHERE up.user_id = auth.uid()
      AND up.role IN ('admin', 'owner')
    )
  );

-- Function to get user's effective permissions (role defaults + overrides)
CREATE OR REPLACE FUNCTION public.get_user_permissions(target_user_id UUID, user_role user_role)
RETURNS TABLE (
  permission escalation_permission,
  is_allowed BOOLEAN,
  is_custom BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(up.permission, rp.permission) as permission,
    COALESCE(up.is_allowed, rp.is_allowed) as is_allowed,
    CASE WHEN up.id IS NOT NULL THEN true ELSE false END as is_custom
  FROM public.role_permissions rp
  LEFT JOIN public.user_permissions up ON (
    up.user_id = target_user_id 
    AND up.permission = rp.permission
  )
  WHERE rp.role = user_role
  ORDER BY rp.permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to initialize user permissions from role defaults
CREATE OR REPLACE FUNCTION public.initialize_user_permissions(target_user_id UUID, user_role user_role)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_permissions (user_id, role, permission, is_allowed, custom_permissions_applied)
  SELECT 
    target_user_id,
    user_role,
    rp.permission,
    rp.is_allowed,
    false
  FROM public.role_permissions rp
  WHERE rp.role = user_role
  ON CONFLICT (user_id, permission) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
