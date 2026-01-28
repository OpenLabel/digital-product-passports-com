-- Drop the old weak storage policies
DROP POLICY IF EXISTS "Users can update their own passport images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own passport images" ON storage.objects;

-- Create new storage policies that verify ownership via folder path
-- Files must be stored in {user_id}/{filename} format
CREATE POLICY "Users can update their own passport images" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'passport-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own passport images" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'passport-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Also update INSERT policy to enforce the same folder structure
DROP POLICY IF EXISTS "Authenticated users can upload passport images" ON storage.objects;
CREATE POLICY "Authenticated users can upload passport images" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'passport-images' AND auth.uid()::text = (storage.foldername(name))[1]);