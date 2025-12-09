/*
  # Fix log_booking_activity Function

  ## Changes Made

  1. Update log_booking_activity function to use correct column names
     - Use 'details' instead of 'old_value' and 'new_value'
     - Use 'user_email' which is required
  2. Fix the function to work with the actual schema
*/

-- =====================================================
-- FIX LOG_BOOKING_ACTIVITY FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION log_booking_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_email text;
BEGIN
  -- Get user email or use a default for anonymous users
  SELECT email INTO v_user_email FROM auth.users WHERE id = auth.uid();
  IF v_user_email IS NULL THEN
    v_user_email := 'anonymous@system.local';
  END IF;

  -- For INSERT operations
  IF TG_OP = 'INSERT' THEN
    INSERT INTO booking_activity_log (
      booking_id,
      user_id,
      user_email,
      action,
      details
    ) VALUES (
      NEW.id,
      auth.uid(),
      v_user_email,
      'CREATED',
      jsonb_build_object(
        'booking_status', NEW.booking_status,
        'payment_status', NEW.payment_status,
        'total_price', NEW.total_price
      )
    );
  -- For UPDATE operations
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO booking_activity_log (
      booking_id,
      user_id,
      user_email,
      action,
      details
    ) VALUES (
      NEW.id,
      auth.uid(),
      v_user_email,
      'UPDATED',
      jsonb_build_object(
        'old', row_to_json(OLD),
        'new', row_to_json(NEW)
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;