
-- Populate role_permissions table with default data (only if it's empty)
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
('vendor', 'can_perform_emergency_shutdowns', false)
ON CONFLICT (role, permission) DO NOTHING;
