-- Remove masked API keys from the authenticated users allowlist
-- These values should not be exposed even in masked form

DROP POLICY IF EXISTS "Authenticated users can read allowed config keys" ON public.site_config;

CREATE POLICY "Authenticated users can read allowed config keys"
ON public.site_config
FOR SELECT
TO authenticated
USING (key IN (
  'company_name',
  'company_address', 
  'privacy_policy_url',
  'terms_conditions_url',
  'ai_enabled',
  'setup_complete',
  'sender_email'
));

-- Note: resend_api_key and lovable_api_key removed from allowlist
-- The actual keys are securely stored in encrypted_secrets table
-- Masked versions in site_config are no longer exposed to authenticated users