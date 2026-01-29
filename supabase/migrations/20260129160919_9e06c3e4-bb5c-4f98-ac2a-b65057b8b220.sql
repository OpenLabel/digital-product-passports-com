-- Remove the encrypted_secrets infrastructure
-- API keys are now stored as Supabase secrets (environment variables)

-- Drop the functions that accessed encrypted secrets
DROP FUNCTION IF EXISTS public.get_decrypted_secret(text);
DROP FUNCTION IF EXISTS public.store_encrypted_secret(text, text, text);
DROP FUNCTION IF EXISTS public.encrypted_secret_exists(text);

-- Drop the encrypted_secrets table
DROP TABLE IF EXISTS public.encrypted_secrets;