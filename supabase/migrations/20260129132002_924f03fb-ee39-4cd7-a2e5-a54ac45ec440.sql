-- Enable pgcrypto for encryption (this is a standard Postgres extension, always available)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a table for encrypted secrets (separate from site_config for better security)
CREATE TABLE IF NOT EXISTS public.encrypted_secrets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  encrypted_value bytea NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on encrypted_secrets - NO direct access allowed
ALTER TABLE public.encrypted_secrets ENABLE ROW LEVEL SECURITY;

-- No policies = no direct access. Only functions with SECURITY DEFINER can access.

-- Create a function to store an encrypted secret
-- Uses AES-256 encryption with a server-side key
CREATE OR REPLACE FUNCTION public.store_encrypted_secret(
  p_name text,
  p_value text,
  p_description text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  encryption_key bytea;
BEGIN
  -- Use the service role key hash as encryption key (available server-side only)
  -- This is derived from a combination of project-specific values
  encryption_key := digest(current_setting('app.settings.jwt_secret', true) || 'dpp_secret_salt', 'sha256');
  
  INSERT INTO public.encrypted_secrets (name, encrypted_value, description)
  VALUES (
    p_name,
    pgp_sym_encrypt(p_value, encode(encryption_key, 'hex')),
    p_description
  )
  ON CONFLICT (name) DO UPDATE SET
    encrypted_value = pgp_sym_encrypt(p_value, encode(encryption_key, 'hex')),
    description = COALESCE(p_description, encrypted_secrets.description),
    updated_at = now();
END;
$function$;

-- Create a function to retrieve a decrypted secret (for use in edge functions)
CREATE OR REPLACE FUNCTION public.get_decrypted_secret(p_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  encryption_key bytea;
  decrypted_value text;
BEGIN
  -- Use the same encryption key
  encryption_key := digest(current_setting('app.settings.jwt_secret', true) || 'dpp_secret_salt', 'sha256');
  
  SELECT pgp_sym_decrypt(encrypted_value, encode(encryption_key, 'hex'))
  INTO decrypted_value
  FROM public.encrypted_secrets
  WHERE name = p_name;
  
  RETURN decrypted_value;
END;
$function$;

-- Create a function to check if an encrypted secret exists
CREATE OR REPLACE FUNCTION public.encrypted_secret_exists(p_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.encrypted_secrets WHERE name = p_name
  );
END;
$function$;

-- Add updated_at trigger
CREATE TRIGGER update_encrypted_secrets_updated_at
  BEFORE UPDATE ON public.encrypted_secrets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();