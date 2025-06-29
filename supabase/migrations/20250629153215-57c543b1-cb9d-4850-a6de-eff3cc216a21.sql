
-- Fix user_profiles table schema to match TypeScript interface
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS position TEXT;

-- Remove columns that shouldn't be there based on the interface
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS role,
DROP COLUMN IF EXISTS status;

-- Add proper foreign key constraints that are missing
ALTER TABLE public.equipment 
ADD CONSTRAINT fk_equipment_type 
FOREIGN KEY (equipment_type_id) REFERENCES public.equipment_types(id);

ALTER TABLE public.equipment 
ADD CONSTRAINT fk_equipment_location 
FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE public.equipment 
ADD CONSTRAINT fk_equipment_room 
FOREIGN KEY (room_id) REFERENCES public.rooms(id);

ALTER TABLE public.equipment_logs 
ADD CONSTRAINT fk_equipment_logs_equipment 
FOREIGN KEY (equipment_id) REFERENCES public.equipment(id);

ALTER TABLE public.knowledge_base 
ADD CONSTRAINT fk_knowledge_base_equipment 
FOREIGN KEY (equipment_id) REFERENCES public.equipment(id);

ALTER TABLE public.rooms 
ADD CONSTRAINT fk_rooms_location 
FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE public.location_billing 
ADD CONSTRAINT fk_location_billing_location 
FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE public.user_location_access 
ADD CONSTRAINT fk_user_location_access_location 
FOREIGN KEY (location_id) REFERENCES public.locations(id);

-- Update the trigger function to handle the correct columns
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, first_name, last_name, phone, company, position)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'company', ''),
        COALESCE(NEW.raw_user_meta_data->>'position', '')
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        RETURN NEW;
END;
$$;
