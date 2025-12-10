/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add missing indexes on foreign keys:
      - `booking_activity_log.user_id`
      - `booking_comments.user_id`
      - `contact_messages.booking_id`
      - `contact_messages.product_id`

  2. RLS Policy Optimization
    - Fix all RLS policies to use `(select auth.<function>())` instead of `auth.<function>()`
    - This prevents re-evaluation for each row, improving performance at scale
    - Affected tables:
      - products
      - bookings
      - contact_messages
      - company_info
      - booking_comments
      - booking_activity_log

  3. Function Security
    - Fix `check_booking_rate_limit` function to have immutable search_path
*/

-- Add missing indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_booking_activity_log_user_id 
  ON public.booking_activity_log(user_id);

CREATE INDEX IF NOT EXISTS idx_booking_comments_user_id 
  ON public.booking_comments(user_id);

CREATE INDEX IF NOT EXISTS idx_contact_messages_booking_id 
  ON public.contact_messages(booking_id);

CREATE INDEX IF NOT EXISTS idx_contact_messages_product_id 
  ON public.contact_messages(product_id);

-- Fix RLS policies for products table
DROP POLICY IF EXISTS "Admin and user roles can view all products" ON public.products;
CREATE POLICY "Admin and user roles can view all products"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') IN ('admin', 'user', 'viewer')
  );

DROP POLICY IF EXISTS "Admin and user roles can insert products" ON public.products;
CREATE POLICY "Admin and user roles can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->>'user_role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Admin and user roles can update products" ON public.products;
CREATE POLICY "Admin and user roles can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') IN ('admin', 'user', 'viewer')
  )
  WITH CHECK (
    (select auth.jwt()->>'user_role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Only admin role can delete products" ON public.products;
CREATE POLICY "Only admin role can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') = 'admin'
  );

-- Fix RLS policies for bookings table
DROP POLICY IF EXISTS "Admin and user roles can view all bookings" ON public.bookings;
CREATE POLICY "Admin and user roles can view all bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') IN ('admin', 'user', 'viewer')
  );

DROP POLICY IF EXISTS "Admin and user roles can insert bookings" ON public.bookings;
CREATE POLICY "Admin and user roles can insert bookings"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->>'user_role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Admin and user roles can update bookings" ON public.bookings;
CREATE POLICY "Admin and user roles can update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') IN ('admin', 'user', 'viewer')
  )
  WITH CHECK (
    (select auth.jwt()->>'user_role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Only admin role can delete bookings" ON public.bookings;
CREATE POLICY "Only admin role can delete bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') = 'admin'
  );

-- Fix RLS policies for contact_messages table
DROP POLICY IF EXISTS "Admin and user roles can view contact messages" ON public.contact_messages;
CREATE POLICY "Admin and user roles can view contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') IN ('admin', 'user', 'viewer')
  );

DROP POLICY IF EXISTS "Admin and user roles can update contact messages" ON public.contact_messages;
CREATE POLICY "Admin and user roles can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') IN ('admin', 'user', 'viewer')
  )
  WITH CHECK (
    (select auth.jwt()->>'user_role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Only admin role can delete contact messages" ON public.contact_messages;
CREATE POLICY "Only admin role can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') = 'admin'
  );

-- Fix RLS policies for company_info table
DROP POLICY IF EXISTS "Admin and user roles can view company info" ON public.company_info;
CREATE POLICY "Admin and user roles can view company info"
  ON public.company_info
  FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') IN ('admin', 'user', 'viewer')
  );

DROP POLICY IF EXISTS "Admin and user roles can insert company info" ON public.company_info;
CREATE POLICY "Admin and user roles can insert company info"
  ON public.company_info
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->>'user_role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Admin and user roles can update company info" ON public.company_info;
CREATE POLICY "Admin and user roles can update company info"
  ON public.company_info
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') IN ('admin', 'user', 'viewer')
  )
  WITH CHECK (
    (select auth.jwt()->>'user_role') IN ('admin', 'user')
  );

-- Fix RLS policies for booking_comments table
DROP POLICY IF EXISTS "Admins can delete comments" ON public.booking_comments;
CREATE POLICY "Admins can delete comments"
  ON public.booking_comments
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') = 'admin'
  );

-- Fix RLS policies for booking_activity_log table
DROP POLICY IF EXISTS "Admin and user roles can view activity logs" ON public.booking_activity_log;
CREATE POLICY "Admin and user roles can view activity logs"
  ON public.booking_activity_log
  FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->>'user_role') IN ('admin', 'user', 'viewer')
  );

DROP POLICY IF EXISTS "Admin and user roles can insert activity logs" ON public.booking_activity_log;
CREATE POLICY "Admin and user roles can insert activity logs"
  ON public.booking_activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->>'user_role') IN ('admin', 'user')
  );

-- Fix check_booking_rate_limit function to have immutable search_path
DROP FUNCTION IF EXISTS public.check_booking_rate_limit();

CREATE FUNCTION public.check_booking_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  recent_count integer;
  rate_limit integer := 5;
  time_window interval := '30 minutes';
BEGIN
  SELECT COUNT(*)
  INTO recent_count
  FROM public.bookings
  WHERE email = NEW.email
    AND phone = NEW.phone
    AND created_at > (NOW() - time_window);

  IF recent_count >= rate_limit THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;

  RETURN NEW;
END;
$$;