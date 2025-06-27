
-- First transaction: Add the new enum values
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'franchisee';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'tech';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'employee';
