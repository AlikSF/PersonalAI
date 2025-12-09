/*
  # Add adults and children fields to bookings table

  1. Changes
    - Add `adults` column to store the number of adults in the booking (required, default 1)
    - Add `children` column to store the number of children in the booking (default 0)

  2. Notes
    - These fields replace storing this information in the special_requests field
    - Adults defaults to 1 (minimum one adult required)
    - Children defaults to 0 (optional)
*/

-- Add adults column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'adults'
  ) THEN
    ALTER TABLE bookings ADD COLUMN adults integer DEFAULT 1 NOT NULL;
  END IF;
END $$;

-- Add children column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'children'
  ) THEN
    ALTER TABLE bookings ADD COLUMN children integer DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Add check constraints to ensure non-negative values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE constraint_name = 'bookings_adults_positive'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_adults_positive CHECK (adults >= 1);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE constraint_name = 'bookings_children_non_negative'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_children_non_negative CHECK (children >= 0);
  END IF;
END $$;
