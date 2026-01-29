-- Remove the public access policy that allows anyone to view passports
-- This prevents scraping - public access is now only via edge function
DROP POLICY IF EXISTS "Anyone can view passports by public slug" ON public.passports;

-- Drop the passports_public view as it's no longer needed
-- (public access is now exclusively through the edge function)
DROP VIEW IF EXISTS public.passports_public;