-- Add display_order column to passports table for manual ordering
ALTER TABLE public.passports 
ADD COLUMN display_order integer DEFAULT 0;

-- Set initial order based on created_at
UPDATE public.passports 
SET display_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as row_num
  FROM public.passports
) AS subquery
WHERE passports.id = subquery.id;

-- Create index for faster ordering queries
CREATE INDEX idx_passports_display_order ON public.passports(user_id, display_order);