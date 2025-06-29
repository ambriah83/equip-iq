
-- First, let's clean up the duplicate foreign key constraints that are causing SelectQueryError
-- Remove the duplicate foreign keys we added in the previous migration
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS fk_equipment_type;
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS fk_equipment_location;
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS fk_equipment_room;
ALTER TABLE public.equipment_logs DROP CONSTRAINT IF EXISTS fk_equipment_logs_equipment;
ALTER TABLE public.knowledge_base DROP CONSTRAINT IF EXISTS fk_knowledge_base_equipment;
ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS fk_rooms_location;
ALTER TABLE public.location_billing DROP CONSTRAINT IF EXISTS fk_location_billing_location;
ALTER TABLE public.user_location_access DROP CONSTRAINT IF EXISTS fk_user_location_access_location;

-- Create a proper user_roles table for role management (since user_profiles no longer has role/status)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'employee',
  status TEXT NOT NULL DEFAULT 'active',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id) -- One role per user for now
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Users can view their own role" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Admins can manage roles" 
  ON public.user_roles 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'owner')
    )
  );

-- Create trigger to update updated_at on user_roles
CREATE TRIGGER set_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Add some default roles for existing users (if any)
INSERT INTO public.user_roles (user_id, role, status)
SELECT id, 'admin', 'active' 
FROM auth.users 
WHERE email LIKE '%admin%' OR email LIKE '%owner%'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, status)
SELECT id, 'employee', 'active' 
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id) DO NOTHING;
