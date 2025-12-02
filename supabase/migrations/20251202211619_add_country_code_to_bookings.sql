/*
  # Add Country Code Fields to Bookings

  1. Changes to `bookings` table
    - Add `country_code` column (e.g., 'RU', 'US', 'TH') to store the ISO country code
    - Add `dial_code` column (e.g., '+7', '+1', '+66') to store the phone dial code
    - Make these columns nullable for backward compatibility with existing bookings
  
  2. Purpose
    - Store country information for better phone number handling
    - Enable proper international phone number formatting
    - Improve contact information organization
  
  3. Notes
    - Existing bookings will have NULL values for these fields
    - New bookings will capture country code and dial code
    - This enables better analytics and customer segmentation by country
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE bookings ADD COLUMN country_code text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'dial_code'
  ) THEN
    ALTER TABLE bookings ADD COLUMN dial_code text;
  END IF;
END $$;