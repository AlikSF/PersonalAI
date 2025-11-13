/*
  # Add Priority Field to Products Table

  1. New Column
    - `priority` (int4, nullable, default NULL) - Display priority for products
      - Lower numbers (1, 2, 3) appear first
      - NULL values appear last
      - Products with priority <= 3 will show HOT badge

  2. Changes
    - Column is nullable to maintain backward compatibility
    - No default value (NULL by default)
    - Existing products will have NULL priority
    - Priority can be manually set in Supabase dashboard

  3. Notes
    - Migration is idempotent-safe (uses IF NOT EXISTS check)
    - No data loss or modification of existing data
    - Products will be sorted by: priority ASC NULLS LAST, then created_at DESC
*/

-- Add priority column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'priority'
  ) THEN
    ALTER TABLE products ADD COLUMN priority INT4 NULL;
    COMMENT ON COLUMN products.priority IS 'Display priority (1, 2, 3...). Lower numbers appear first. NULL appears last. Priority <= 3 shows HOT badge.';
  END IF;
END $$;