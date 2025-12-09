/*
  # Fix Booking Status Constraint and Anonymous Insert

  ## Changes Made

  1. Update booking_status CHECK constraint to include 'pending' status
  2. Verify and fix RLS policy for anonymous booking creation

  ## Details
  - Add 'pending' to allowed booking_status values
  - Ensure anonymous users can create bookings from the website
*/

-- =====================================================
-- 1. UPDATE BOOKING STATUS CHECK CONSTRAINT
-- =====================================================

-- Drop the old constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_booking_status_check;

-- Create new constraint that includes 'pending'
ALTER TABLE bookings ADD CONSTRAINT bookings_booking_status_check
  CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- =====================================================
-- 2. VERIFY PUBLIC INSERT POLICY EXISTS
-- =====================================================

-- Recreate the public insert policy to ensure it works
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;

CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);