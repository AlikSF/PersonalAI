/*
  # Add Chinese, French, and Uzbek Language Fields to Products Table

  1. New Columns - Chinese Simplified (zh)
    - `name_zh` (text, nullable) - Chinese translation of product name
    - `description_zh` (text, nullable) - Chinese translation of product description
    - `location_zh` (text, nullable) - Chinese translation of product location
    - `category_zh` (text, nullable) - Chinese translation of product category
    - `features_zh` (jsonb, nullable) - Chinese translations of product features stored as JSONB array

  2. New Columns - French (fr)
    - `name_fr` (text, nullable) - French translation of product name
    - `description_fr` (text, nullable) - French translation of product description
    - `location_fr` (text, nullable) - French translation of product location
    - `category_fr` (text, nullable) - French translation of product category
    - `features_fr` (jsonb, nullable) - French translations of product features stored as JSONB array

  3. New Columns - Uzbek (uz)
    - `name_uz` (text, nullable) - Uzbek translation of product name
    - `description_uz` (text, nullable) - Uzbek translation of product description
    - `location_uz` (text, nullable) - Uzbek translation of product location
    - `category_uz` (text, nullable) - Uzbek translation of product category
    - `features_uz` (jsonb, nullable) - Uzbek translations of product features stored as JSONB array

  4. Changes
    - All new columns are nullable to maintain backward compatibility
    - Existing Russian, English, Kazakh, Kyrgyz, and Azerbaijani fields remain unchanged
    - No data loss or modification of existing data
    - Falls back to base fields (name, description, location, category, features) when language-specific fields are NULL

  5. Notes
    - Migration is idempotent-safe (uses IF NOT EXISTS checks)
    - Language-specific fields are optional
    - When NULL, frontend will use base field values as fallback
    - Features fields use JSONB to store arrays of strings
*/

-- Add name_zh column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'name_zh'
  ) THEN
    ALTER TABLE products ADD COLUMN name_zh TEXT NULL;
    COMMENT ON COLUMN products.name_zh IS 'Chinese translation of product name. Falls back to name if NULL.';
  END IF;
END $$;

-- Add description_zh column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'description_zh'
  ) THEN
    ALTER TABLE products ADD COLUMN description_zh TEXT NULL;
    COMMENT ON COLUMN products.description_zh IS 'Chinese translation of product description. Falls back to description if NULL.';
  END IF;
END $$;

-- Add location_zh column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'location_zh'
  ) THEN
    ALTER TABLE products ADD COLUMN location_zh TEXT NULL;
    COMMENT ON COLUMN products.location_zh IS 'Chinese translation of product location. Falls back to location if NULL.';
  END IF;
END $$;

-- Add category_zh column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category_zh'
  ) THEN
    ALTER TABLE products ADD COLUMN category_zh TEXT NULL;
    COMMENT ON COLUMN products.category_zh IS 'Chinese translation of product category. Falls back to category translation key if NULL.';
  END IF;
END $$;

-- Add features_zh column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'features_zh'
  ) THEN
    ALTER TABLE products ADD COLUMN features_zh JSONB NULL;
    COMMENT ON COLUMN products.features_zh IS 'Chinese translations of product features stored as JSONB array. Falls back to features column if NULL.';
  END IF;
END $$;

-- Add name_fr column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'name_fr'
  ) THEN
    ALTER TABLE products ADD COLUMN name_fr TEXT NULL;
    COMMENT ON COLUMN products.name_fr IS 'French translation of product name. Falls back to name if NULL.';
  END IF;
END $$;

-- Add description_fr column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'description_fr'
  ) THEN
    ALTER TABLE products ADD COLUMN description_fr TEXT NULL;
    COMMENT ON COLUMN products.description_fr IS 'French translation of product description. Falls back to description if NULL.';
  END IF;
END $$;

-- Add location_fr column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'location_fr'
  ) THEN
    ALTER TABLE products ADD COLUMN location_fr TEXT NULL;
    COMMENT ON COLUMN products.location_fr IS 'French translation of product location. Falls back to location if NULL.';
  END IF;
END $$;

-- Add category_fr column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category_fr'
  ) THEN
    ALTER TABLE products ADD COLUMN category_fr TEXT NULL;
    COMMENT ON COLUMN products.category_fr IS 'French translation of product category. Falls back to category translation key if NULL.';
  END IF;
END $$;

-- Add features_fr column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'features_fr'
  ) THEN
    ALTER TABLE products ADD COLUMN features_fr JSONB NULL;
    COMMENT ON COLUMN products.features_fr IS 'French translations of product features stored as JSONB array. Falls back to features column if NULL.';
  END IF;
END $$;

-- Add name_uz column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'name_uz'
  ) THEN
    ALTER TABLE products ADD COLUMN name_uz TEXT NULL;
    COMMENT ON COLUMN products.name_uz IS 'Uzbek translation of product name. Falls back to name if NULL.';
  END IF;
END $$;

-- Add description_uz column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'description_uz'
  ) THEN
    ALTER TABLE products ADD COLUMN description_uz TEXT NULL;
    COMMENT ON COLUMN products.description_uz IS 'Uzbek translation of product description. Falls back to description if NULL.';
  END IF;
END $$;

-- Add location_uz column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'location_uz'
  ) THEN
    ALTER TABLE products ADD COLUMN location_uz TEXT NULL;
    COMMENT ON COLUMN products.location_uz IS 'Uzbek translation of product location. Falls back to location if NULL.';
  END IF;
END $$;

-- Add category_uz column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category_uz'
  ) THEN
    ALTER TABLE products ADD COLUMN category_uz TEXT NULL;
    COMMENT ON COLUMN products.category_uz IS 'Uzbek translation of product category. Falls back to category translation key if NULL.';
  END IF;
END $$;

-- Add features_uz column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'features_uz'
  ) THEN
    ALTER TABLE products ADD COLUMN features_uz JSONB NULL;
    COMMENT ON COLUMN products.features_uz IS 'Uzbek translations of product features stored as JSONB array. Falls back to features column if NULL.';
  END IF;
END $$;