-- Add short_url to the allowed config keys in the RLS policy
DROP POLICY IF EXISTS "Authenticated users can read allowed config keys" ON public.site_config;

CREATE POLICY "Authenticated users can read allowed config keys" 
ON public.site_config 
FOR SELECT 
USING (key = ANY (ARRAY['company_name'::text, 'company_address'::text, 'privacy_policy_url'::text, 'terms_conditions_url'::text, 'ai_enabled'::text, 'setup_complete'::text, 'sender_email'::text, 'short_url'::text]));