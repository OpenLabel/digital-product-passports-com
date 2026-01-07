-- Create enum for product categories
CREATE TYPE public.product_category AS ENUM ('wine', 'battery', 'textiles', 'other');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create digital product passports table
CREATE TABLE public.passports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category product_category NOT NULL DEFAULT 'other',
  image_url TEXT,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  category_data JSONB DEFAULT '{}',
  public_slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for passport images
INSERT INTO storage.buckets (id, name, public) VALUES ('passport-images', 'passport-images', true);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passports ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Passports RLS policies
CREATE POLICY "Users can view their own passports" 
  ON public.passports FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view passports by public slug" 
  ON public.passports FOR SELECT 
  USING (public_slug IS NOT NULL);

CREATE POLICY "Users can create their own passports" 
  ON public.passports FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own passports" 
  ON public.passports FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own passports" 
  ON public.passports FOR DELETE 
  USING (auth.uid() = user_id);

-- Storage policies for passport images
CREATE POLICY "Anyone can view passport images" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'passport-images');

CREATE POLICY "Authenticated users can upload passport images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'passport-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own passport images" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'passport-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own passport images" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'passport-images' AND auth.role() = 'authenticated');

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_passports_updated_at
  BEFORE UPDATE ON public.passports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate unique public slug
CREATE OR REPLACE FUNCTION public.generate_public_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.public_slug IS NULL THEN
    NEW.public_slug = lower(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to auto-generate slug on insert
CREATE TRIGGER generate_passport_slug
  BEFORE INSERT ON public.passports
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_public_slug();