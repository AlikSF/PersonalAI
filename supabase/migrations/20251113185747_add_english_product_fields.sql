/*
  # Add English Product Fields

  1. New Columns
    - `name_en` (text, nullable) - English translation of product name
    - `description_en` (text, nullable) - English translation of product description
    - `location_en` (text, nullable) - English translation of location
    - `features_en` (text[], nullable) - English translation of features array

  2. Changes
    - All new fields are nullable to maintain backward compatibility
    - Existing Russian fields (name, description, location, features) remain unchanged
    - Products without English translations will use Russian fallback in the UI

  3. Notes
    - This migration is idempotent-safe (uses IF NOT EXISTS checks)
    - No data loss or modification of existing columns
    - English fields are optional; site works normally if left empty
*/

-- Add name_en column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'name_en'
  ) THEN
    ALTER TABLE products ADD COLUMN name_en TEXT NULL;
  END IF;
END $$;

-- Add description_en column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'description_en'
  ) THEN
    ALTER TABLE products ADD COLUMN description_en TEXT NULL;
  END IF;
END $$;

-- Add location_en column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'location_en'
  ) THEN
    ALTER TABLE products ADD COLUMN location_en TEXT NULL;
  END IF;
END $$;

-- Add features_en column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'features_en'
  ) THEN
    ALTER TABLE products ADD COLUMN features_en TEXT[] NULL;
  END IF;
END $$;