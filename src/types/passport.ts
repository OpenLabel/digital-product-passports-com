import type { Json } from '@/integrations/supabase/types';

export type ProductCategory = 
  | 'wine' 
  | 'battery' 
  | 'textiles' 
  | 'construction'
  | 'electronics'
  | 'iron_steel'
  | 'aluminum'
  | 'toys'
  | 'cosmetics'
  | 'furniture'
  | 'tires'
  | 'detergents'
  | 'other';

export interface Passport {
  id: string;
  user_id: string;
  name: string;
  category: ProductCategory;
  image_url: string | null;
  description: string | null;
  language: string;
  category_data: Json | null;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface PassportFormData {
  name: string;
  category: ProductCategory;
  image_url: string | null;
  description: string;
  language: string;
  category_data: Json;
}
