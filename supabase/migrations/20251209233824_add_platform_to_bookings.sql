/*
  # Add platform field to bookings table

  1. Changes
    - Add `platform` column to store the communication platform (telegram or whatsapp)
    - Set default value to 'telegram' for existing bookings

  2. Notes
    - Platform indicates which messaging platform the customer prefers for communication
    - Existing bookings will default to 'telegram'
*/

-- Add platform column to bookings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'platform'
  ) THEN
    ALTER TABLE bookings ADD COLUMN platform text DEFAULT 'telegram';
  END IF;
END $$;
