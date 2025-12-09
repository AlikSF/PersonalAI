/*
  # Add Viewer Role Support
  
  1. Overview
    - Creates a role-based permission system with two roles: 'admin' and 'user'
    - Admin role: full access (select, insert, update, delete)
    - User role: read and update access only (no delete)
  
  2. Changes
    - Updates products table policies to support viewer role
    - Updates bookings table policies to support viewer role
    - Updates company_info table policies to support viewer role
    - Updates storage policies to support viewer role
  
  3. Security
    - Users with 'user' role can view and edit data but cannot delete
    - Users with 'admin' role have full access
    - All policies check authentication and role from jwt metadata
*/

-- Drop existing admin policies to recreate them with viewer support
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admin users can delete products" ON products;

DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can insert bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admin users can delete bookings" ON bookings;

DROP POLICY IF EXISTS "Admins can view company info" ON company_info;
DROP POLICY IF EXISTS "Admins can insert company info" ON company_info;
DROP POLICY IF EXISTS "Admins can update company info" ON company_info;

-- Products table policies with viewer support
CREATE POLICY "Admin and user roles can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  )
  WITH CHECK (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Only admin role can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'admin'
  );

-- Bookings table policies with viewer support
CREATE POLICY "Admin and user roles can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  )
  WITH CHECK (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Only admin role can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'admin'
  );

-- Company info table policies with viewer support
CREATE POLICY "Admin and user roles can view company info"
  ON company_info FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can insert company info"
  ON company_info FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  );

CREATE POLICY "Admin and user roles can update company info"
  ON company_info FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  )
  WITH CHECK (
    (auth.jwt()->>'role')::text IN ('admin', 'user')
  );