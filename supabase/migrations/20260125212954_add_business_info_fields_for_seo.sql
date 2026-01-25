/*
  # Add Business Information Fields for SEO

  This migration adds new fields to the company_info table to support
  local SEO requirements and Schema.org structured data.

  1. New Columns
    - `phone` (text) - Business phone number (must match Google Maps exactly)
    - `email` (text) - Business email address
    - `opening_hours` (text) - Business operating hours in structured format
    - `google_maps_url` (text) - URL for embedded Google Maps iframe
    - `google_maps_place_id` (text) - Google Place ID for Schema.org
    - `business_category` (text) - Primary business category (e.g., "Travel Agency")
    
  2. Multilingual Support
    - `opening_hours_en`, `opening_hours_az`, `opening_hours_kk`, `opening_hours_ky`, 
      `opening_hours_zh`, `opening_hours_fr`, `opening_hours_uz` for translations

  3. Purpose
    - Enable NAP consistency with Google Business Profile
    - Support Schema.org LocalBusiness/TravelAgency markup
    - Improve local SEO rankings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'phone'
  ) THEN
    ALTER TABLE company_info ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'email'
  ) THEN
    ALTER TABLE company_info ADD COLUMN email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'opening_hours'
  ) THEN
    ALTER TABLE company_info ADD COLUMN opening_hours text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'opening_hours_en'
  ) THEN
    ALTER TABLE company_info ADD COLUMN opening_hours_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'opening_hours_az'
  ) THEN
    ALTER TABLE company_info ADD COLUMN opening_hours_az text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'opening_hours_kk'
  ) THEN
    ALTER TABLE company_info ADD COLUMN opening_hours_kk text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'opening_hours_ky'
  ) THEN
    ALTER TABLE company_info ADD COLUMN opening_hours_ky text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'opening_hours_zh'
  ) THEN
    ALTER TABLE company_info ADD COLUMN opening_hours_zh text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'opening_hours_fr'
  ) THEN
    ALTER TABLE company_info ADD COLUMN opening_hours_fr text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'opening_hours_uz'
  ) THEN
    ALTER TABLE company_info ADD COLUMN opening_hours_uz text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'google_maps_url'
  ) THEN
    ALTER TABLE company_info ADD COLUMN google_maps_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'google_maps_place_id'
  ) THEN
    ALTER TABLE company_info ADD COLUMN google_maps_place_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'company_info' AND column_name = 'business_category'
  ) THEN
    ALTER TABLE company_info ADD COLUMN business_category text DEFAULT 'Travel Agency';
  END IF;
END $$;