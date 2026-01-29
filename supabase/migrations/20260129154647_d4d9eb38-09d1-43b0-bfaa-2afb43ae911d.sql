-- Fix 1: Replace denylist with allowlist for site_config SELECT policy
-- Drop the existing denylist policy
DROP POLICY IF EXISTS "Authenticated users can read non-sensitive config" ON public.site_config;

-- Create new allowlist policy - only explicitly approved keys are readable
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
  'sender_email',
  'resend_api_key',
  'lovable_api_key'
));