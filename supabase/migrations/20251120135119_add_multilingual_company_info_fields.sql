/*
  # Add Multilingual Fields to Company Info Table

  1. New Columns
    - `address_az` (text, nullable) - Azerbaijani version of company address
    - `address_kk` (text, nullable) - Kazakh version of company address
    - `address_ky` (text, nullable) - Kyrgyz version of company address
    
    - `license_info_az` (text, nullable) - Azerbaijani version of license information
    - `license_info_kk` (text, nullable) - Kazakh version of license information
    - `license_info_ky` (text, nullable) - Kyrgyz version of license information
    
    - `insurance_info_az` (text, nullable) - Azerbaijani version of insurance information
    - `insurance_info_kk` (text, nullable) - Kazakh version of insurance information
    - `insurance_info_ky` (text, nullable) - Kyrgyz version of insurance information
    
    - `payment_info_az` (text, nullable) - Azerbaijani version of payment information
    - `payment_info_kk` (text, nullable) - Kazakh version of payment information
    - `payment_info_ky` (text, nullable) - Kyrgyz version of payment information

  2. Changes
    - All new columns are nullable to maintain backward compatibility
    - Existing Russian and English fields remain unchanged
    - No data loss or modification of existing data
    - Falls back to Russian fields when language-specific fields are NULL

  3. Notes
    - Migration is idempotent-safe (uses IF NOT EXISTS checks)
    - Language-specific fields are optional
    - When NULL, frontend will use Russian field values as fallback
*/

-- Add address_az column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'address_az'
  ) THEN
    ALTER TABLE company_info ADD COLUMN address_az TEXT NULL;
    COMMENT ON COLUMN company_info.address_az IS 'Azerbaijani translation of company address. Falls back to address if NULL.';
  END IF;
END $$;

-- Add address_kk column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'address_kk'
  ) THEN
    ALTER TABLE company_info ADD COLUMN address_kk TEXT NULL;
    COMMENT ON COLUMN company_info.address_kk IS 'Kazakh translation of company address. Falls back to address if NULL.';
  END IF;
END $$;

-- Add address_ky column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'address_ky'
  ) THEN
    ALTER TABLE company_info ADD COLUMN address_ky TEXT NULL;
    COMMENT ON COLUMN company_info.address_ky IS 'Kyrgyz translation of company address. Falls back to address if NULL.';
  END IF;
END $$;

-- Add license_info_az column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'license_info_az'
  ) THEN
    ALTER TABLE company_info ADD COLUMN license_info_az TEXT NULL;
    COMMENT ON COLUMN company_info.license_info_az IS 'Azerbaijani translation of license information. Falls back to license_info if NULL.';
  END IF;
END $$;

-- Add license_info_kk column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'license_info_kk'
  ) THEN
    ALTER TABLE company_info ADD COLUMN license_info_kk TEXT NULL;
    COMMENT ON COLUMN company_info.license_info_kk IS 'Kazakh translation of license information. Falls back to license_info if NULL.';
  END IF;
END $$;

-- Add license_info_ky column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'license_info_ky'
  ) THEN
    ALTER TABLE company_info ADD COLUMN license_info_ky TEXT NULL;
    COMMENT ON COLUMN company_info.license_info_ky IS 'Kyrgyz translation of license information. Falls back to license_info if NULL.';
  END IF;
END $$;

-- Add insurance_info_az column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'insurance_info_az'
  ) THEN
    ALTER TABLE company_info ADD COLUMN insurance_info_az TEXT NULL;
    COMMENT ON COLUMN company_info.insurance_info_az IS 'Azerbaijani translation of insurance information. Falls back to insurance_info if NULL.';
  END IF;
END $$;

-- Add insurance_info_kk column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'insurance_info_kk'
  ) THEN
    ALTER TABLE company_info ADD COLUMN insurance_info_kk TEXT NULL;
    COMMENT ON COLUMN company_info.insurance_info_kk IS 'Kazakh translation of insurance information. Falls back to insurance_info if NULL.';
  END IF;
END $$;

-- Add insurance_info_ky column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'insurance_info_ky'
  ) THEN
    ALTER TABLE company_info ADD COLUMN insurance_info_ky TEXT NULL;
    COMMENT ON COLUMN company_info.insurance_info_ky IS 'Kyrgyz translation of insurance information. Falls back to insurance_info if NULL.';
  END IF;
END $$;

-- Add payment_info_az column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'payment_info_az'
  ) THEN
    ALTER TABLE company_info ADD COLUMN payment_info_az TEXT NULL;
    COMMENT ON COLUMN company_info.payment_info_az IS 'Azerbaijani translation of payment information. Falls back to payment_info if NULL.';
  END IF;
END $$;

-- Add payment_info_kk column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'payment_info_kk'
  ) THEN
    ALTER TABLE company_info ADD COLUMN payment_info_kk TEXT NULL;
    COMMENT ON COLUMN company_info.payment_info_kk IS 'Kazakh translation of payment information. Falls back to payment_info if NULL.';
  END IF;
END $$;

-- Add payment_info_ky column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'payment_info_ky'
  ) THEN
    ALTER TABLE company_info ADD COLUMN payment_info_ky TEXT NULL;
    COMMENT ON COLUMN company_info.payment_info_ky IS 'Kyrgyz translation of payment information. Falls back to payment_info if NULL.';
  END IF;
END $$;