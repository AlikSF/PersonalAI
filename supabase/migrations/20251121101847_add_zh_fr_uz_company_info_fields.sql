/*
  # Add Chinese, French, and Uzbek Language Fields to Company Info Table

  1. New Columns - Chinese Simplified (zh)
    - `address_zh` (text, nullable) - Chinese translation of company address
    - `license_info_zh` (text, nullable) - Chinese translation of license information
    - `insurance_info_zh` (text, nullable) - Chinese translation of insurance information
    - `payment_info_zh` (text, nullable) - Chinese translation of payment information

  2. New Columns - French (fr)
    - `address_fr` (text, nullable) - French translation of company address
    - `license_info_fr` (text, nullable) - French translation of license information
    - `insurance_info_fr` (text, nullable) - French translation of insurance information
    - `payment_info_fr` (text, nullable) - French translation of payment information

  3. New Columns - Uzbek (uz)
    - `address_uz` (text, nullable) - Uzbek translation of company address
    - `license_info_uz` (text, nullable) - Uzbek translation of license information
    - `insurance_info_uz` (text, nullable) - Uzbek translation of insurance information
    - `payment_info_uz` (text, nullable) - Uzbek translation of payment information

  4. Changes
    - All new columns are nullable to maintain backward compatibility
    - Existing Russian, English, Kazakh, Kyrgyz, and Azerbaijani fields remain unchanged
    - No data loss or modification of existing data
    - Falls back to Russian fields when language-specific fields are NULL

  5. Notes
    - Migration is idempotent-safe (uses IF NOT EXISTS checks)
    - Language-specific fields are optional
    - When NULL, frontend will use Russian field values as fallback
*/

-- Add address_zh column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'address_zh'
  ) THEN
    ALTER TABLE company_info ADD COLUMN address_zh TEXT NULL;
    COMMENT ON COLUMN company_info.address_zh IS 'Chinese translation of company address. Falls back to address if NULL.';
  END IF;
END $$;

-- Add license_info_zh column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'license_info_zh'
  ) THEN
    ALTER TABLE company_info ADD COLUMN license_info_zh TEXT NULL;
    COMMENT ON COLUMN company_info.license_info_zh IS 'Chinese translation of license information. Falls back to license_info if NULL.';
  END IF;
END $$;

-- Add insurance_info_zh column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'insurance_info_zh'
  ) THEN
    ALTER TABLE company_info ADD COLUMN insurance_info_zh TEXT NULL;
    COMMENT ON COLUMN company_info.insurance_info_zh IS 'Chinese translation of insurance information. Falls back to insurance_info if NULL.';
  END IF;
END $$;

-- Add payment_info_zh column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'payment_info_zh'
  ) THEN
    ALTER TABLE company_info ADD COLUMN payment_info_zh TEXT NULL;
    COMMENT ON COLUMN company_info.payment_info_zh IS 'Chinese translation of payment information. Falls back to payment_info if NULL.';
  END IF;
END $$;

-- Add address_fr column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'address_fr'
  ) THEN
    ALTER TABLE company_info ADD COLUMN address_fr TEXT NULL;
    COMMENT ON COLUMN company_info.address_fr IS 'French translation of company address. Falls back to address if NULL.';
  END IF;
END $$;

-- Add license_info_fr column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'license_info_fr'
  ) THEN
    ALTER TABLE company_info ADD COLUMN license_info_fr TEXT NULL;
    COMMENT ON COLUMN company_info.license_info_fr IS 'French translation of license information. Falls back to license_info if NULL.';
  END IF;
END $$;

-- Add insurance_info_fr column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'insurance_info_fr'
  ) THEN
    ALTER TABLE company_info ADD COLUMN insurance_info_fr TEXT NULL;
    COMMENT ON COLUMN company_info.insurance_info_fr IS 'French translation of insurance information. Falls back to insurance_info if NULL.';
  END IF;
END $$;

-- Add payment_info_fr column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'payment_info_fr'
  ) THEN
    ALTER TABLE company_info ADD COLUMN payment_info_fr TEXT NULL;
    COMMENT ON COLUMN company_info.payment_info_fr IS 'French translation of payment information. Falls back to payment_info if NULL.';
  END IF;
END $$;

-- Add address_uz column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'address_uz'
  ) THEN
    ALTER TABLE company_info ADD COLUMN address_uz TEXT NULL;
    COMMENT ON COLUMN company_info.address_uz IS 'Uzbek translation of company address. Falls back to address if NULL.';
  END IF;
END $$;

-- Add license_info_uz column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'license_info_uz'
  ) THEN
    ALTER TABLE company_info ADD COLUMN license_info_uz TEXT NULL;
    COMMENT ON COLUMN company_info.license_info_uz IS 'Uzbek translation of license information. Falls back to license_info if NULL.';
  END IF;
END $$;

-- Add insurance_info_uz column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'insurance_info_uz'
  ) THEN
    ALTER TABLE company_info ADD COLUMN insurance_info_uz TEXT NULL;
    COMMENT ON COLUMN company_info.insurance_info_uz IS 'Uzbek translation of insurance information. Falls back to insurance_info if NULL.';
  END IF;
END $$;

-- Add payment_info_uz column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'payment_info_uz'
  ) THEN
    ALTER TABLE company_info ADD COLUMN payment_info_uz TEXT NULL;
    COMMENT ON COLUMN company_info.payment_info_uz IS 'Uzbek translation of payment information. Falls back to payment_info if NULL.';
  END IF;
END $$;