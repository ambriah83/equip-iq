
-- Drop existing policies and recreate them properly for equipment_types table
DROP POLICY IF EXISTS "Authenticated users can view equipment types" ON public.equipment_types;
DROP POLICY IF EXISTS "Authenticated users can insert equipment types" ON public.equipment_types;
DROP POLICY IF EXISTS "Authenticated users can update equipment types" ON public.equipment_types;
DROP POLICY IF EXISTS "Authenticated users can delete equipment types" ON public.equipment_types;

-- Recreate the policies with proper permissions
CREATE POLICY "Authenticated users can view equipment types"
  ON public.equipment_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert equipment types"
  ON public.equipment_types FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update equipment types"
  ON public.equipment_types FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete equipment types"
  ON public.equipment_types FOR DELETE
  TO authenticated
  USING (true);
