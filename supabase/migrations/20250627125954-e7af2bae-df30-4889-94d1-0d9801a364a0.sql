
-- Add manager role to the enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'manager';

-- Create default permissions for manager role in role_permissions table
INSERT INTO public.role_permissions (role, permission, is_allowed) VALUES
-- Manager permissions (operational management level)
('manager', 'can_use_ladder', true),
('manager', 'can_handle_electrical', false),
('manager', 'can_disassemble_parts', true),
('manager', 'can_work_at_height', true),
('manager', 'can_handle_chemicals', false),
('manager', 'can_operate_heavy_equipment', false),
('manager', 'can_access_restricted_areas', true),
('manager', 'can_perform_emergency_shutdowns', true)
ON CONFLICT (role, permission) DO NOTHING;
