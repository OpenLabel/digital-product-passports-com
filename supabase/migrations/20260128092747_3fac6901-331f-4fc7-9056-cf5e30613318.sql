-- Add new product categories to support all DPP-covered product types
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'construction';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'electronics';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'iron_steel';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'aluminum';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'toys';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'cosmetics';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'furniture';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'tires';
ALTER TYPE public.product_category ADD VALUE IF NOT EXISTS 'detergents';