/*
  # Add SEO-friendly slug to products table

  1. New Columns
    - `slug` (text, unique) - URL-friendly identifier for each product/tour
    
  2. Changes
    - Adds unique constraint on slug column
    - Creates index for fast slug lookups
    - Generates initial slugs from existing product names

  3. Notes
    - Slugs are auto-generated from Russian names, converted to URL-friendly format
    - Existing products will get slugs based on their names
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'slug'
  ) THEN
    ALTER TABLE products ADD COLUMN slug text;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
DECLARE
  result text;
BEGIN
  result := lower(input_text);
  
  result := translate(result, 
    'абвгдеёжзийклмнопрстуфхцчшщъыьэюя',
    'abvgdeejziiklmnoprstufhccssiieua');
  
  result := regexp_replace(result, '[^a-z0-9\s-]', '', 'g');
  result := regexp_replace(result, '\s+', '-', 'g');
  result := regexp_replace(result, '-+', '-', 'g');
  result := trim(both '-' from result);
  
  IF length(result) < 3 THEN
    result := 'tour-' || substr(md5(input_text), 1, 8);
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

UPDATE products 
SET slug = generate_slug(COALESCE(name_en, name)) || '-' || substr(id::text, 1, 8)
WHERE slug IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'products_slug_unique'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT products_slug_unique UNIQUE (slug);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

DROP FUNCTION IF EXISTS generate_slug(text);