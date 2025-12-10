/*
  # Fix log_comment_activity Function Schema Mismatch

  ## Problem
  The log_comment_activity function is trying to insert into non-existent columns:
  - Trying to use: old_value, new_value
  - Actual columns: user_email (required), action, details

  This causes the trigger to fail when inserting comments.

  ## Solution
  Rewrite the function to match the actual booking_activity_log schema:
  - Use 'user_email' (required, not null)
  - Use 'action' for the action type
  - Use 'details' (jsonb) for storing the comment data
*/

CREATE OR REPLACE FUNCTION log_comment_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_email text;
BEGIN
  -- Get user email, required for activity log
  SELECT email INTO v_user_email FROM auth.users WHERE id = NEW.user_id;
  IF v_user_email IS NULL THEN
    v_user_email := COALESCE(NEW.user_email, 'unknown@system.local');
  END IF;

  -- Log comment addition
  IF TG_OP = 'INSERT' THEN
    INSERT INTO booking_activity_log (
      booking_id,
      user_id,
      user_email,
      action,
      details
    ) VALUES (
      NEW.booking_id,
      NEW.user_id,
      v_user_email,
      'comment_added',
      jsonb_build_object('comment_preview', LEFT(NEW.comment, 100))
    );
  
  -- Log comment update
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO booking_activity_log (
      booking_id,
      user_id,
      user_email,
      action,
      details
    ) VALUES (
      NEW.booking_id,
      NEW.user_id,
      v_user_email,
      'comment_updated',
      jsonb_build_object(
        'old_comment', LEFT(OLD.comment, 100),
        'new_comment', LEFT(NEW.comment, 100)
      )
    );
  
  -- Log comment deletion
  ELSIF TG_OP = 'DELETE' THEN
    SELECT email INTO v_user_email FROM auth.users WHERE id = auth.uid();
    IF v_user_email IS NULL THEN
      v_user_email := 'system@local';
    END IF;
    
    INSERT INTO booking_activity_log (
      booking_id,
      user_id,
      user_email,
      action,
      details
    ) VALUES (
      OLD.booking_id,
      auth.uid(),
      v_user_email,
      'comment_deleted',
      jsonb_build_object('comment_preview', LEFT(OLD.comment, 100))
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;
