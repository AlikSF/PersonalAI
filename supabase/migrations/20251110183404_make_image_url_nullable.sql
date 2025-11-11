/*
  # Make image_url nullable
  
  1. Changes
    - Alter `image_url` column in `products` table to be nullable
    - This allows creating products without specifying image_url since we now use the `images` jsonb array
  
  2. Notes
    - The `images` field is the primary way to store product images
    - `image_url` is kept for backward compatibility but is no longer required
*/

ALTER TABLE products 
ALTER COLUMN image_url DROP NOT NULL;