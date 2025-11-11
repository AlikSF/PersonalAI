/*
  # Add tour_date column to bookings table

  1. Changes
    - Add `tour_date` column (date type) to bookings table
    - This column will be used for tour-based bookings instead of start_date/end_date
    - Keep existing columns for backward compatibility

  2. Important Notes
    - This migration does NOT drop existing start_date/end_date columns
    - The application will use tour_date for new tour bookings
    - Existing data remains intact
*/

-- Add tour_date column to bookings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'tour_date'
  ) THEN
    ALTER TABLE bookings ADD COLUMN tour_date DATE;
  END IF;
END $$;