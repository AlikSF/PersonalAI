/*
  # Fix RLS Policies and Add Rate Limiting

  ## Security Improvements

  1. **contact_messages table**
     - Restrict UPDATE operations to admin and user roles only
     - Remove overly permissive policy that allowed ANY authenticated user

  2. **booking_activity_log table**
     - Restrict SELECT operations to admin and user roles only
     - Prevent regular authenticated users from viewing activity logs

  3. **booking_comments table**
     - Already secure (users can only update their own comments)

  ## Rate Limiting for Bookings

  4. **Rate limiting function**
     - Created `check_booking_rate_limit()` function
     - Limits bookings to 3 per hour per phone/email combination
     - Prevents spam and abuse

  5. **Updated booking policies**
     - Public can create bookings ONLY if rate limit check passes
     - Protects against unlimited booking creation
*/

-- ============================================
-- PART 1: Fix contact_messages RLS policies
-- ============================================

-- Drop the overly permissive update policy
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;

-- Create restricted update policy for admin and user roles only
CREATE POLICY "Admin and user roles can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) IN ('admin', 'user')
  )
  WITH CHECK (
    (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) IN ('admin', 'user')
  );

-- ============================================
-- PART 2: Fix activity_log RLS policies
-- ============================================

-- Drop the overly permissive select policy
DROP POLICY IF EXISTS "Authenticated users can view all activity logs" ON booking_activity_log;

-- Create restricted select policy for admin and user roles only
CREATE POLICY "Admin and user roles can view activity logs"
  ON booking_activity_log
  FOR SELECT
  TO authenticated
  USING (
    (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) IN ('admin', 'user')
  );

-- Update insert policy to restrict to admin/user roles
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON booking_activity_log;

CREATE POLICY "Admin and user roles can insert activity logs"
  ON booking_activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) IN ('admin', 'user')
  );

-- ============================================
-- PART 3: Rate Limiting for Bookings
-- ============================================

-- Create a function to check booking rate limits
CREATE OR REPLACE FUNCTION check_booking_rate_limit(
  p_customer_phone TEXT,
  p_customer_email TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  recent_bookings_count INTEGER;
BEGIN
  -- Count bookings from the same phone OR email in the last hour
  SELECT COUNT(*)
  INTO recent_bookings_count
  FROM bookings
  WHERE (
    customer_phone = p_customer_phone 
    OR customer_email = p_customer_email
  )
  AND created_at > NOW() - INTERVAL '1 hour';

  -- Allow if less than 3 bookings in the last hour
  RETURN recent_bookings_count < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the public booking insert policy to include rate limit check
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;

CREATE POLICY "Public can create bookings with rate limit"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (
    check_booking_rate_limit(customer_phone, customer_email)
  );

-- ============================================
-- PART 4: Add helpful indexes for performance
-- ============================================

-- Index for rate limit query performance
CREATE INDEX IF NOT EXISTS idx_bookings_recent_phone_email 
  ON bookings(customer_phone, customer_email, created_at DESC);

-- Index for activity log queries
CREATE INDEX IF NOT EXISTS idx_activity_log_booking_created 
  ON booking_activity_log(booking_id, created_at DESC);
