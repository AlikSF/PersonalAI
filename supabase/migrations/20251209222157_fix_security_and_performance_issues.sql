/*
  # Fix Security and Performance Issues

  ## Changes Made

  ### 1. Add Missing Foreign Key Indexes
  - Add index on `booking_activity_log.user_id`
  - Add index on `booking_comments.user_id`
  - Add index on `contact_messages.booking_id`
  - Add index on `contact_messages.product_id`

  ### 2. Optimize RLS Policies (Auth Initialization)
  - Replace `auth.jwt()` with `(select auth.jwt())` in all policies
  - This prevents re-evaluation for each row, improving performance at scale

  ### 3. Remove Unused Indexes
  - Drop `idx_booking_comments_created_at` (not used)
  - Drop `idx_booking_activity_log_created_at` (not used)

  ### 4. Consolidate Duplicate Policies
  - Remove duplicate INSERT policy for contact_messages (anon role)
  - Remove duplicate SELECT policy for contact_messages (authenticated role)

  ### 5. Fix Function Search Path
  - Set immutable search_path for functions to prevent security issues
*/

-- =====================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_booking_activity_log_user_id ON booking_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_comments_user_id ON booking_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_booking_id ON contact_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_product_id ON contact_messages(product_id);

-- =====================================================
-- 2. REMOVE UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS idx_booking_comments_created_at;
DROP INDEX IF EXISTS idx_booking_activity_log_created_at;

-- =====================================================
-- 3. CONSOLIDATE DUPLICATE POLICIES
-- =====================================================

-- Remove duplicate anon INSERT policies for contact_messages
DROP POLICY IF EXISTS "Anyone can send contact messages" ON contact_messages;

-- Remove duplicate authenticated SELECT policies for contact_messages
DROP POLICY IF EXISTS "Authenticated users can view all contact messages" ON contact_messages;

-- =====================================================
-- 4. FIX RLS POLICIES - OPTIMIZE AUTH FUNCTION CALLS
-- =====================================================

-- DROP ALL EXISTING POLICIES THAT NEED TO BE FIXED

-- Products policies
DROP POLICY IF EXISTS "Admin and user roles can view all products" ON products;
DROP POLICY IF EXISTS "Admin and user roles can insert products" ON products;
DROP POLICY IF EXISTS "Admin and user roles can update products" ON products;
DROP POLICY IF EXISTS "Only admin role can delete products" ON products;

-- Bookings policies
DROP POLICY IF EXISTS "Admin and user roles can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admin and user roles can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Admin and user roles can update bookings" ON bookings;
DROP POLICY IF EXISTS "Only admin role can delete bookings" ON bookings;

-- Company info policies
DROP POLICY IF EXISTS "Admin and user roles can view company info" ON company_info;
DROP POLICY IF EXISTS "Admin and user roles can insert company info" ON company_info;
DROP POLICY IF EXISTS "Admin and user roles can update company info" ON company_info;

-- Contact messages policies
DROP POLICY IF EXISTS "Admin and user roles can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Only admin role can delete contact messages" ON contact_messages;

-- Booking comments policies
DROP POLICY IF EXISTS "Authenticated users can add comments" ON booking_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON booking_comments;
DROP POLICY IF EXISTS "Admins can delete comments" ON booking_comments;

-- Booking activity log policies
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON booking_activity_log;

-- RECREATE POLICIES WITH OPTIMIZED AUTH FUNCTION CALLS

-- =====================================================
-- PRODUCTS POLICIES (OPTIMIZED)
-- =====================================================

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
-- BOOKINGS POLICIES (OPTIMIZED)
-- =====================================================

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
-- COMPANY INFO POLICIES (OPTIMIZED)
-- =====================================================

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
-- CONTACT MESSAGES POLICIES (OPTIMIZED)
-- =====================================================

CREATE POLICY "Admin and user roles can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = ANY(ARRAY['admin', 'user']));

CREATE POLICY "Only admin role can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin');

-- =====================================================
-- BOOKING COMMENTS POLICIES (OPTIMIZED)
-- =====================================================

CREATE POLICY "Authenticated users can add comments"
  ON booking_comments FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update their own comments"
  ON booking_comments FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can delete comments"
  ON booking_comments FOR DELETE
  TO authenticated
  USING ((select (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin');

-- =====================================================
-- BOOKING ACTIVITY LOG POLICIES (OPTIMIZED)
-- =====================================================

CREATE POLICY "Authenticated users can insert activity logs"
  ON booking_activity_log FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- =====================================================
-- 5. FIX FUNCTION SEARCH PATHS
-- =====================================================

-- Fix log_booking_activity function
CREATE OR REPLACE FUNCTION log_booking_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO booking_activity_log (
    booking_id,
    user_id,
    action,
    old_value,
    new_value
  ) VALUES (
    NEW.id,
    auth.uid(),
    TG_OP,
    row_to_json(OLD),
    row_to_json(NEW)
  );
  RETURN NEW;
END;
$$;

-- Fix log_comment_activity function
CREATE OR REPLACE FUNCTION log_comment_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO booking_activity_log (
      booking_id,
      user_id,
      action,
      new_value
    ) VALUES (
      NEW.booking_id,
      NEW.user_id,
      'COMMENT_ADDED',
      json_build_object('comment', NEW.comment)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO booking_activity_log (
      booking_id,
      user_id,
      action,
      old_value,
      new_value
    ) VALUES (
      NEW.booking_id,
      NEW.user_id,
      'COMMENT_UPDATED',
      json_build_object('comment', OLD.comment),
      json_build_object('comment', NEW.comment)
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO booking_activity_log (
      booking_id,
      user_id,
      action,
      old_value
    ) VALUES (
      OLD.booking_id,
      auth.uid(),
      'COMMENT_DELETED',
      json_build_object('comment', OLD.comment)
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;