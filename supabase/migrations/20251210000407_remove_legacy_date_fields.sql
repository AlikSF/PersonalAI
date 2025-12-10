/*
  # Remove Legacy Date Fields
  
  1. Changes
    - Drop `start_date` column from bookings table (no longer needed for tour agency)
    - Drop `end_date` column from bookings table (no longer needed for tour agency)
    - Keep `tour_date` as the single source of truth for tour dates
  
  2. Notes
    - These fields were legacy from when the system was for rentals
    - Tours only need a single date, not date ranges
    - All functionality now uses `tour_date` field
*/

-- Drop the legacy date columns
ALTER TABLE bookings DROP COLUMN IF EXISTS start_date;
ALTER TABLE bookings DROP COLUMN IF EXISTS end_date;
