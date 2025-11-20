/*
  # Add Kazakh, Kyrgyz, and Azerbaijani Language Fields to Products

  1. Changes to `products` table
    - Add `name_kk` (text, nullable) - Kazakh translation of product name
    - Add `description_kk` (text, nullable) - Kazakh translation of product description
    - Add `location_kk` (text, nullable) - Kazakh translation of product location
    - Add `features_kk` (jsonb, nullable) - Kazakh translations of product features (JSONB array)
    - Add `category_kk` (text, nullable) - Kazakh translation of product category
    
    - Add `name_ky` (text, nullable) - Kyrgyz translation of product name
    - Add `description_ky` (text, nullable) - Kyrgyz translation of product description
    - Add `location_ky` (text, nullable) - Kyrgyz translation of product location
    - Add `features_ky` (jsonb, nullable) - Kyrgyz translations of product features (JSONB array)
    - Add `category_ky` (text, nullable) - Kyrgyz translation of product category
    
    - Add `name_az` (text, nullable) - Azerbaijani translation of product name
    - Add `description_az` (text, nullable) - Azerbaijani translation of product description
    - Add `location_az` (text, nullable) - Azerbaijani translation of product location
    - Add `features_az` (jsonb, nullable) - Azerbaijani translations of product features (JSONB array)
    - Add `category_az` (text, nullable) - Azerbaijani translation of product category

  2. Notes
    - All new fields are nullable and will fall back to Russian (default) fields if NULL
    - Features fields use the same JSONB array format as the existing features column
    - This enables full multilingual support for the tour booking platform
*/

-- Add Kazakh (KK) language fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_kk text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_kk text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS location_kk text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features_kk jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_kk text;

COMMENT ON COLUMN products.name_kk IS 'Kazakh translation of product name. Falls back to name if NULL.';
COMMENT ON COLUMN products.description_kk IS 'Kazakh translation of product description. Falls back to description if NULL.';
COMMENT ON COLUMN products.location_kk IS 'Kazakh translation of product location. Falls back to location if NULL.';
COMMENT ON COLUMN products.features_kk IS 'Kazakh translations of product features stored as JSONB array (same format as features column). Falls back to features column if NULL.';
COMMENT ON COLUMN products.category_kk IS 'Kazakh translation of product category. Falls back to category translation key if NULL.';

-- Add Kyrgyz (KY) language fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_ky text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_ky text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS location_ky text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features_ky jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_ky text;

COMMENT ON COLUMN products.name_ky IS 'Kyrgyz translation of product name. Falls back to name if NULL.';
COMMENT ON COLUMN products.description_ky IS 'Kyrgyz translation of product description. Falls back to description if NULL.';
COMMENT ON COLUMN products.location_ky IS 'Kyrgyz translation of product location. Falls back to location if NULL.';
COMMENT ON COLUMN products.features_ky IS 'Kyrgyz translations of product features stored as JSONB array (same format as features column). Falls back to features column if NULL.';
COMMENT ON COLUMN products.category_ky IS 'Kyrgyz translation of product category. Falls back to category translation key if NULL.';

-- Add Azerbaijani (AZ) language fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_az text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_az text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS location_az text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS features_az jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_az text;

COMMENT ON COLUMN products.name_az IS 'Azerbaijani translation of product name. Falls back to name if NULL.';
COMMENT ON COLUMN products.description_az IS 'Azerbaijani translation of product description. Falls back to description if NULL.';
COMMENT ON COLUMN products.location_az IS 'Azerbaijani translation of product location. Falls back to location if NULL.';
COMMENT ON COLUMN products.features_az IS 'Azerbaijani translations of product features stored as JSONB array (same format as features column). Falls back to features column if NULL.';
COMMENT ON COLUMN products.category_az IS 'Azerbaijani translation of product category. Falls back to category translation key if NULL.';
