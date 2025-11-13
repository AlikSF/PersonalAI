/*
  # Add English Category Field

  1. New Column
    - `category_en` (text, nullable) - English translation of product category
    
  2. Changes
    - Column is nullable to maintain backward compatibility
    - Existing products without category_en will use translation fallback
    - No data loss or modification of existing columns

  3. Notes
    - This migration is idempotent-safe (uses IF NOT EXISTS check)
    - category_en is optional; site works normally if left empty
    - Falls back to category translations (t('category.xxx')) when NULL
*/

-- Add category_en column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category_en'
  ) THEN
    ALTER TABLE products ADD COLUMN category_en TEXT NULL;
  END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN products.category_en IS 'English translation of product category. Falls back to category translation key if NULL.';