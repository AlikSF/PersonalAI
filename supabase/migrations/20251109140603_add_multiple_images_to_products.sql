/*
  # Add Multiple Images Support to Products

  ## Changes
  1. Add `images` column to products table
    - Type: jsonb array to store multiple image URLs
    - Default: empty array
  
  2. Migration Strategy
    - Add new `images` column
    - Migrate existing `image_url` data to `images` array
    - Keep `image_url` for backward compatibility (will be deprecated)
  
  ## Notes
  - Existing products will have their `image_url` migrated to the first item in `images` array
  - New products should use `images` array for multiple photos
*/

-- Add images column to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'images'
  ) THEN
    ALTER TABLE products ADD COLUMN images jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Migrate existing image_url to images array
UPDATE products 
SET images = jsonb_build_array(image_url)
WHERE images = '[]'::jsonb AND image_url IS NOT NULL AND image_url != '';
