/*
  # Add Storage Policies for Photos Bucket

  1. Overview
    - Enables authenticated users to manage files in the Photos bucket
    - Allows admins to upload, update, and delete images
    
  2. Security
    - Only authenticated users can upload files
    - Only authenticated users can delete files
    - All users can view files (public read access)
    
  3. Important Notes
    - The Photos bucket must be created manually in Supabase Dashboard if it doesn't exist
    - These policies apply to the entire Photos bucket
*/

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can upload to Photos bucket" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can update Photos bucket files" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can delete Photos bucket files" ON storage.objects;
    DROP POLICY IF EXISTS "Public users can view Photos bucket files" ON storage.objects;
END $$;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload to Photos bucket"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'Photos');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update Photos bucket files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'Photos')
  WITH CHECK (bucket_id = 'Photos');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete Photos bucket files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'Photos');

-- Allow public read access to all files
CREATE POLICY "Public users can view Photos bucket files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'Photos');
