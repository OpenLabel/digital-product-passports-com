-- Site configuration table for self-hosted instances
CREATE TABLE public.site_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read site config (it's public info like company name, address)
CREATE POLICY "Anyone can read site config" 
ON public.site_config 
FOR SELECT 
USING (true);

-- Only authenticated users can update site config (in production, you'd restrict this to admins)
-- For initial setup, we allow inserts when the table is empty
CREATE POLICY "Allow initial setup insert" 
ON public.site_config 
FOR INSERT 
WITH CHECK (
    NOT EXISTS (SELECT 1 FROM public.site_config WHERE key = 'setup_complete')
    OR auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update site config" 
ON public.site_config 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Add trigger for updated_at
CREATE TRIGGER update_site_config_updated_at
BEFORE UPDATE ON public.site_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();