-- Drop the permissive update policy that allows any authenticated user to modify config
DROP POLICY IF EXISTS "Authenticated users can update site config" ON public.site_config;

-- Create a restricted policy that only allows updates during initial setup
-- Once setup_complete = 'true', no updates are allowed via RLS
CREATE POLICY "Allow updates only during initial setup"
ON public.site_config
FOR UPDATE
USING (
  auth.uid() IS NOT NULL 
  AND NOT EXISTS (
    SELECT 1 FROM public.site_config 
    WHERE key = 'setup_complete' AND value = 'true'
  )
);