/*
  # Update Booking Rate Limit

  ## Changes
  - Update rate limit from 3 bookings per hour to 5 bookings per 30 minutes
  - More permissive for legitimate customers while still preventing abuse
*/

-- Update the rate limit function
CREATE OR REPLACE FUNCTION check_booking_rate_limit(
  p_customer_phone TEXT,
  p_customer_email TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  recent_bookings_count INTEGER;
BEGIN
  -- Count bookings from the same phone OR email in the last 30 minutes
  SELECT COUNT(*)
  INTO recent_bookings_count
  FROM bookings
  WHERE (
    customer_phone = p_customer_phone 
    OR customer_email = p_customer_email
  )
  AND created_at > NOW() - INTERVAL '30 minutes';

  -- Allow if less than 5 bookings in the last 30 minutes
  RETURN recent_bookings_count < 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
