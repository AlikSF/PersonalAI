/*
  # Add English Fields to Company Info Table

  1. New Columns
    - `address_en` (text, nullable) - English version of company address
    - `license_info_en` (text, nullable) - English version of license information
    - `insurance_info_en` (text, nullable) - English version of insurance information
    - `payment_info_en` (text, nullable) - English version of payment information

  2. Changes
    - All new columns are nullable to maintain backward compatibility
    - Existing Russian fields remain unchanged and required
    - No data loss or modification of existing data
    - Falls back to Russian fields when English fields are NULL

  3. Notes
    - Migration is idempotent-safe (uses IF NOT EXISTS checks)
    - English fields are optional; site works normally if left empty
    - When NULL, frontend will use Russian field values
    - The `name` field is NOT changed and remains as is
*/

-- Add address_en column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'address_en'
  ) THEN
    ALTER TABLE company_info ADD COLUMN address_en TEXT NULL;
    COMMENT ON COLUMN company_info.address_en IS 'English translation of company address. Falls back to address if NULL.';
  END IF;
END $$;

-- Add license_info_en column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'license_info_en'
  ) THEN
    ALTER TABLE company_info ADD COLUMN license_info_en TEXT NULL;
    COMMENT ON COLUMN company_info.license_info_en IS 'English translation of license information. Falls back to license_info if NULL.';
  END IF;
END $$;

-- Add insurance_info_en column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'insurance_info_en'
  ) THEN
    ALTER TABLE company_info ADD COLUMN insurance_info_en TEXT NULL;
    COMMENT ON COLUMN company_info.insurance_info_en IS 'English translation of insurance information. Falls back to insurance_info if NULL.';
  END IF;
END $$;

-- Add payment_info_en column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'payment_info_en'
  ) THEN
    ALTER TABLE company_info ADD COLUMN payment_info_en TEXT NULL;
    COMMENT ON COLUMN company_info.payment_info_en IS 'English translation of payment information. Falls back to payment_info if NULL.';
  END IF;
END $$;