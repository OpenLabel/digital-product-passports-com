-- Remove the email column from profiles table since it's redundant
-- The email is already securely stored in auth.users and accessible via auth.email()
-- This eliminates the risk of email exposure through the profiles table

ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;