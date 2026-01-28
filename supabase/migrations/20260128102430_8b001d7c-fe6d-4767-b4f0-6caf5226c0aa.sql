-- Create a public view for passports that excludes user_id
CREATE VIEW public.passports_public
WITH (security_invoker=on) AS
  SELECT 
    id,
    name,
    category,
    category_data,
    created_at,
    updated_at,
    public_slug,
    image_url,
    description,
    language
  FROM public.passports
  WHERE public_slug IS NOT NULL;

-- Grant access to the view for anonymous users
GRANT SELECT ON public.passports_public TO anon;
GRANT SELECT ON public.passports_public TO authenticated;