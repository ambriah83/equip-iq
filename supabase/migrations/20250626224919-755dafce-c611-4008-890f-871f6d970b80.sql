
-- Fix the search_path issues for existing functions
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.get_user_permissions(uuid, user_role) SET search_path = 'public';
ALTER FUNCTION public.initialize_user_permissions(uuid, user_role) SET search_path = 'public';
ALTER FUNCTION public.set_updated_at() SET search_path = 'public';

-- Update the functions to be more secure by explicitly setting search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
