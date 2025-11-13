/*
  # Fix features_en Column Type from TEXT[] to JSONB

  1. Changes
    - Change `features_en` column type from TEXT[] (PostgreSQL array) to JSONB
    - This makes it consistent with the `features` column which is already JSONB
    - Convert any existing TEXT[] data to JSONB array format

  2. Data Conversion
    - NULL values remain NULL
    - Empty arrays → NULL
    - TEXT[] arrays → Convert to JSONB arrays

  3. Consistency
    - Both features and features_en are now JSONB type
    - Frontend can handle both uniformly as string[]
    - Maintains backward compatibility with NULL values
*/

-- Change column type from TEXT[] to JSONB
-- The USING clause handles the conversion
ALTER TABLE products 
ALTER COLUMN features_en TYPE jsonb 
USING 
  CASE 
    WHEN features_en IS NULL THEN NULL
    WHEN array_length(features_en, 1) IS NULL THEN NULL
    ELSE to_jsonb(features_en)
  END;

-- Add comment for documentation
COMMENT ON COLUMN products.features_en IS 'English translations of product features stored as JSONB array (same format as features column). Falls back to features column if NULL.';