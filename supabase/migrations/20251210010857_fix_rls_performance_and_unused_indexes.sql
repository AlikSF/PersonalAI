/*
  # Fix RLS Performance and Remove Unused Indexes

  ## Issues Fixed

  ### 1. RLS Performance Optimization
  - Replace all `auth.<function>()` calls with `(select auth.<function>())` to prevent re-evaluation per row
  - Affects policies on: products, bookings, contact_messages, company_info, booking_comments, booking_activity_log

  ### 2. Remove Unused Indexes
  - Drop indexes that are not being used by queries:
    - idx_booking_activity_log_user_id
    - idx_booking_comments_user_id
    - idx_contact_messages_booking_id
    - idx_contact_messages_product_id
    - idx_activity_log_booking_created

  ### 3. Fix Function Search Path
  - Set immutable search_path for check_booking_rate_limit function

  ## Security
  - All policies maintain the same security logic
  - Only performance optimizations applied
*/

-- =====================================================
-- 1. DROP UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS idx_booking_activity_log_user_id;
DROP INDEX IF EXISTS idx_booking_comments_user_id;
DROP INDEX IF EXISTS idx_contact_messages_booking_id;
DROP INDEX IF EXISTS idx_contact_messages_product_id;
DROP INDEX IF EXISTS idx_activity_log_booking_created;

-- =====================================================
-- 2. FIX RLS POLICIES - PRODUCTS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Admin and user roles can view all products" ON products;
DROP POLICY IF EXISTS "Admin and user roles can insert products" ON products;
DROP POLICY IF EXISTS "Admin and user roles can update products" ON products;
DROP POLICY IF EXISTS "Only admin role can delete products" ON products;

CREATE POLICY "Admin and user roles can view all products"
  ON products FOR SELECT
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Admin and user roles can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Admin and user roles can update products"
  ON products FOR UPDATE
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']))
  WITH CHECK ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Only admin role can delete products"
  ON products FOR DELETE
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin');

-- =====================================================
-- 3. FIX RLS POLICIES - BOOKINGS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Admin and user roles can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admin and user roles can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Admin and user roles can update bookings" ON bookings;
DROP POLICY IF EXISTS "Only admin role can delete bookings" ON bookings;

CREATE POLICY "Admin and user roles can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Admin and user roles can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Admin and user roles can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']))
  WITH CHECK ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Only admin role can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin');

-- =====================================================
-- 4. FIX RLS POLICIES - CONTACT_MESSAGES TABLE
-- =====================================================

DROP POLICY IF EXISTS "Admin and user roles can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admin and user roles can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Only admin role can delete contact messages" ON contact_messages;

CREATE POLICY "Admin and user roles can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Admin and user roles can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']))
  WITH CHECK ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Only admin role can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin');

-- =====================================================
-- 5. FIX RLS POLICIES - COMPANY_INFO TABLE
-- =====================================================

DROP POLICY IF EXISTS "Admin and user roles can view company info" ON company_info;
DROP POLICY IF EXISTS "Admin and user roles can insert company info" ON company_info;
DROP POLICY IF EXISTS "Admin and user roles can update company info" ON company_info;

CREATE POLICY "Admin and user roles can view company info"
  ON company_info FOR SELECT
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Admin and user roles can insert company info"
  ON company_info FOR INSERT
  TO authenticated
  WITH CHECK ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Admin and user roles can update company info"
  ON company_info FOR UPDATE
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']))
  WITH CHECK ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

-- =====================================================
-- 6. FIX RLS POLICIES - BOOKING_COMMENTS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Admins can delete comments" ON booking_comments;

CREATE POLICY "Admins can delete comments"
  ON booking_comments FOR DELETE
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin');

-- =====================================================
-- 7. FIX RLS POLICIES - BOOKING_ACTIVITY_LOG TABLE
-- =====================================================

DROP POLICY IF EXISTS "Admin and user roles can view activity logs" ON booking_activity_log;
DROP POLICY IF EXISTS "Admin and user roles can insert activity logs" ON booking_activity_log;

CREATE POLICY "Admin and user roles can view activity logs"
  ON booking_activity_log FOR SELECT
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Admin and user roles can insert activity logs"
  ON booking_activity_log FOR INSERT
  TO authenticated
  WITH CHECK ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

-- =====================================================
-- 8. FIX FUNCTION SEARCH PATH
-- =====================================================

CREATE OR REPLACE FUNCTION check_booking_rate_limit()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  recent_bookings INTEGER;
  client_ip TEXT;
BEGIN
  -- Get the client IP from request headers (if available)
  client_ip := current_setting('request.headers', true)::json->>'x-forwarded-for';
  
  -- If no IP, use a fallback identifier
  IF client_ip IS NULL THEN
    client_ip := 'unknown';
  END IF;

  -- Count recent bookings from this IP in the last 30 minutes
  SELECT COUNT(*)
  INTO recent_bookings
  FROM bookings
  WHERE created_at > NOW() - INTERVAL '30 minutes'
    AND platform = client_ip;

  -- Allow up to 5 bookings per 30 minutes
  RETURN recent_bookings < 5;
END;
$$;
