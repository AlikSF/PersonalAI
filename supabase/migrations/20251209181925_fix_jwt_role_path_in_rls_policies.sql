/*
  # Fix JWT Role Path in RLS Policies
  
  1. Issue
    - Current policies look for auth.jwt()->>'role'
    - But the role is actually stored in auth.jwt()->'app_metadata'->>'role'
    - This causes all queries to fail because the role check returns null
  
  2. Solution
    - Drop all existing role-based policies
    - Recreate them with the correct JWT path to app_metadata.role
  
  3. Changes Made
    - Update all SELECT, INSERT, UPDATE, DELETE policies
    - Fix path: auth.jwt()->>'role' → auth.jwt()->'app_metadata'->>'role'
    - Applies to products, bookings, company_info, and contact_messages tables
*/

-- ========================================
-- STEP 1: Drop all existing policies
-- ========================================

-- Products
DROP POLICY IF EXISTS "Admin and user roles can view all products" ON products;
DROP POLICY IF EXISTS "Admin and user roles can insert products" ON products;
DROP POLICY IF EXISTS "Admin and user roles can update products" ON products;
DROP POLICY IF EXISTS "Only admin role can delete products" ON products;
DROP POLICY IF EXISTS "Public can view products" ON products;

-- Bookings
DROP POLICY IF EXISTS "Admin and user roles can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admin and user roles can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Admin and user roles can update bookings" ON bookings;
DROP POLICY IF EXISTS "Only admin role can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Public can create bookings" ON bookings;

-- Company info
DROP POLICY IF EXISTS "Admin and user roles can view company info" ON company_info;
DROP POLICY IF EXISTS "Admin and user roles can insert company info" ON company_info;
DROP POLICY IF EXISTS "Admin and user roles can update company info" ON company_info;
DROP POLICY IF EXISTS "Public can view company info" ON company_info;

-- Contact messages
DROP POLICY IF EXISTS "Admin and user roles can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Only admin role can delete contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Public can create contact messages" ON contact_messages;

-- ========================================
-- STEP 2: Create fixed policies for products
-- ========================================

CREATE POLICY "Admin and user roles can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  )
  WITH CHECK (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  );

CREATE POLICY "Only admin role can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text = 'admin'
  );

-- Allow public to view products (for the website)
CREATE POLICY "Public can view products"
  ON products FOR SELECT
  TO anon
  USING (true);

-- ========================================
-- STEP 3: Create fixed policies for bookings
-- ========================================

CREATE POLICY "Admin and user roles can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  )
  WITH CHECK (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  );

CREATE POLICY "Only admin role can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text = 'admin'
  );

-- Allow public to create bookings (for the website booking form)
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

-- ========================================
-- STEP 4: Create fixed policies for company_info
-- ========================================

CREATE POLICY "Admin and user roles can view company info"
  ON company_info FOR SELECT
  TO authenticated
  USING (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can insert company info"
  ON company_info FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can update company info"
  ON company_info FOR UPDATE
  TO authenticated
  USING (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  )
  WITH CHECK (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  );

-- Allow public to view company info (for the website)
CREATE POLICY "Public can view company info"
  ON company_info FOR SELECT
  TO anon
  USING (true);

-- ========================================
-- STEP 5: Create fixed policies for contact_messages
-- ========================================

CREATE POLICY "Admin and user roles can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text IN ('admin', 'user')
  );

CREATE POLICY "Only admin role can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (
    (SELECT (auth.jwt()->'app_metadata'->>'role'))::text = 'admin'
  );

-- Allow public to create contact messages (for the website contact form)
CREATE POLICY "Public can create contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);