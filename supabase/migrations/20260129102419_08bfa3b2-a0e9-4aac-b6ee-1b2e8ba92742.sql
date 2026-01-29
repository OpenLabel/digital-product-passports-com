-- Update the generate_public_slug function to create 32-character slugs
-- This makes brute-force attacks computationally infeasible
CREATE OR REPLACE FUNCTION public.generate_public_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.public_slug IS NULL THEN
    -- Generate a 32-character hex slug using multiple random sources for entropy
    NEW.public_slug = lower(
      substring(md5(random()::text || clock_timestamp()::text) from 1 for 16) ||
      substring(md5(random()::text || gen_random_uuid()::text) from 1 for 16)
    );
  END IF;
  RETURN NEW;
END;
$function$;