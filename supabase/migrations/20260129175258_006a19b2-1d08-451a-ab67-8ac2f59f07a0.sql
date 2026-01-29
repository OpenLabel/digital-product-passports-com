-- Update the slug generation trigger to create 16-character slugs (64 bits of entropy)
-- With rate limiting of 30 req/min, brute-forcing would take ~1 trillion years
CREATE OR REPLACE FUNCTION public.generate_public_slug()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.public_slug IS NULL THEN
    -- Generate a 16-character hex slug (64 bits of entropy)
    -- Still cryptographically secure with rate limiting in place
    NEW.public_slug = lower(
      substring(md5(random()::text || clock_timestamp()::text || gen_random_uuid()::text) from 1 for 16)
    );
  END IF;
  RETURN NEW;
END;
$function$;