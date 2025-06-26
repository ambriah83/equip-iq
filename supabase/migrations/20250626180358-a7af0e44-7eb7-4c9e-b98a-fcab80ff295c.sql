
-- Update policies to allow both authenticated and anonymous users
DROP POLICY IF EXISTS "Authenticated users can view equipment types" ON public.equipment_types;
DROP POLICY IF EXISTS "Authenticated users can insert equipment types" ON public.equipment_types;
DROP POLICY IF EXISTS "Authenticated users can update equipment types" ON public.equipment_types;
DROP POLICY IF EXISTS "Authenticated users can delete equipment types" ON public.equipment_types;

-- Create new policies that allow both authenticated and anonymous access
CREATE POLICY "Users can view equipment types"
  ON public.equipment_types FOR SELECT
  USING (true);

CREATE POLICY "Users can insert equipment types"
  ON public.equipment_types FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update equipment types"
  ON public.equipment_types FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete equipment types"
  ON public.equipment_types FOR DELETE
  USING (true);
