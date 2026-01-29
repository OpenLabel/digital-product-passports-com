-- Drop the dangerous public read policy
DROP POLICY IF EXISTS "Anyone can read site config" ON public.site_config;

-- Create a restrictive policy that only allows reading non-sensitive config
-- Sensitive keys (containing 'secret', 'api_key', 'password', 'token') are blocked from client reads
CREATE POLICY "Authenticated users can read non-sensitive config"
ON public.site_config
FOR SELECT
TO authenticated
USING (
  key NOT ILIKE '%secret%' 
  AND key NOT ILIKE '%api_key%' 
  AND key NOT ILIKE '%password%' 
  AND key NOT ILIKE '%token%'
);

-- Allow anonymous users to only read setup_complete status (needed for setup flow)
CREATE POLICY "Anyone can check setup status"
ON public.site_config
FOR SELECT
TO anon
USING (key = 'setup_complete');