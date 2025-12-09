/*
  # Fix RLS Performance and Security Issues
  
  1. Performance Improvements
    - Optimize all RLS policies to use (select auth.jwt()) instead of auth.jwt()
    - This prevents re-evaluation of auth functions for each row
  
  2. Policy Cleanup
    - Remove duplicate/old policies that conflict with new role-based policies
    - Keep only the optimized role-based policies
  
  3. Security Fixes
    - Fix function search_path to be immutable for security
    - Remove unused indexes
  
  4. Changes Made
    - Drop all old duplicate policies
    - Recreate optimized policies with (select ...) syntax
    - Update handle_new_user_role function with stable search_path
    - Remove unused indexes on contact_messages table
*/

-- ========================================
-- STEP 1: Drop all old and duplicate policies
-- ========================================

-- Products table - drop old policies
DROP POLICY IF EXISTS "Anyone can view all products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;
DROP POLICY IF EXISTS "Admin can delete products" ON products;

-- Drop the new policies we just created (to recreate them with optimizations)
DROP POLICY IF EXISTS "Admin and user roles can view all products" ON products;
DROP POLICY IF EXISTS "Admin and user roles can insert products" ON products;
DROP POLICY IF EXISTS "Admin and user roles can update products" ON products;
DROP POLICY IF EXISTS "Only admin role can delete products" ON products;

-- Bookings table - drop old policies
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can delete bookings" ON bookings;

-- Drop the new policies (to recreate with optimizations)
DROP POLICY IF EXISTS "Admin and user roles can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admin and user roles can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Admin and user roles can update bookings" ON bookings;
DROP POLICY IF EXISTS "Only admin role can delete bookings" ON bookings;

-- Company info table - drop old policies
DROP POLICY IF EXISTS "Anyone can view company info" ON company_info;
DROP POLICY IF EXISTS "Authenticated users can insert company info" ON company_info;
DROP POLICY IF EXISTS "Authenticated users can update company info" ON company_info;

-- Drop the new policies (to recreate with optimizations)
DROP POLICY IF EXISTS "Admin and user roles can view company info" ON company_info;
DROP POLICY IF EXISTS "Admin and user roles can insert company info" ON company_info;
DROP POLICY IF EXISTS "Admin and user roles can update company info" ON company_info;

-- Contact messages - drop old policies
DROP POLICY IF EXISTS "Admin can delete contact messages" ON contact_messages;

-- ========================================
-- STEP 2: Create optimized policies for products
-- ========================================

CREATE POLICY "Admin and user roles can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Only admin role can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role')::text = 'admin'
  );

-- Allow public to view products (for the website)
CREATE POLICY "Public can view products"
  ON products FOR SELECT
  TO anon
  USING (true);

-- ========================================
-- STEP 3: Create optimized policies for bookings
-- ========================================

CREATE POLICY "Admin and user roles can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Only admin role can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role')::text = 'admin'
  );

-- Allow public to create bookings (for the website booking form)
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- ========================================
-- STEP 4: Create optimized policies for company_info
-- ========================================

CREATE POLICY "Admin and user roles can view company info"
  ON company_info FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can insert company info"
  ON company_info FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can update company info"
  ON company_info FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  )
  WITH CHECK (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  );

-- Allow public to view company info (for the website)
CREATE POLICY "Public can view company info"
  ON company_info FOR SELECT
  TO anon
  USING (true);

-- ========================================
-- STEP 5: Create optimized policies for contact_messages
-- ========================================

CREATE POLICY "Admin and user roles can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Only admin role can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt()->>'role')::text = 'admin'
  );

-- Allow public to create contact messages (for the website contact form)
CREATE POLICY "Public can create contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- ========================================
-- STEP 6: Fix function security
-- ========================================

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_app_meta_data IS NULL OR NEW.raw_app_meta_data->>'role' IS NULL THEN
    NEW.raw_app_meta_data = COALESCE(NEW.raw_app_meta_data, '{}'::jsonb) || '{"role": "user"}'::jsonb;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ========================================
-- STEP 7: Remove unused indexes
-- ========================================

DROP INDEX IF EXISTS idx_contact_messages_booking_id;
DROP INDEX IF EXISTS idx_contact_messages_product_id;