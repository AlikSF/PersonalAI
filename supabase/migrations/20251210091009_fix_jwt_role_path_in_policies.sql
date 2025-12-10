/*
  # Fix JWT Role Path in RLS Policies

  1. Issue
    - RLS policies were checking `auth.jwt()->>'user_role'` 
    - But the actual path is `auth.jwt()->'app_metadata'->>'role'`
    - This caused all authenticated users to be denied access

  2. Fix
    - Update all RLS policies to use correct JWT path
    - Ensures admin panel can access data properly
*/

-- Fix RLS policies for products table
DROP POLICY IF EXISTS "Admin and user roles can view all products" ON public.products;
CREATE POLICY "Admin and user roles can view all products"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user', 'viewer')
  );

DROP POLICY IF EXISTS "Admin and user roles can insert products" ON public.products;
CREATE POLICY "Admin and user roles can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Admin and user roles can update products" ON public.products;
CREATE POLICY "Admin and user roles can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user', 'viewer')
  )
  WITH CHECK (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Only admin role can delete products" ON public.products;
CREATE POLICY "Only admin role can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

-- Fix RLS policies for bookings table
DROP POLICY IF EXISTS "Admin and user roles can view all bookings" ON public.bookings;
CREATE POLICY "Admin and user roles can view all bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user', 'viewer')
  );

DROP POLICY IF EXISTS "Admin and user roles can insert bookings" ON public.bookings;
CREATE POLICY "Admin and user roles can insert bookings"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Admin and user roles can update bookings" ON public.bookings;
CREATE POLICY "Admin and user roles can update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user', 'viewer')
  )
  WITH CHECK (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Only admin role can delete bookings" ON public.bookings;
CREATE POLICY "Only admin role can delete bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

-- Fix RLS policies for contact_messages table
DROP POLICY IF EXISTS "Admin and user roles can view contact messages" ON public.contact_messages;
CREATE POLICY "Admin and user roles can view contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user', 'viewer')
  );

DROP POLICY IF EXISTS "Admin and user roles can update contact messages" ON public.contact_messages;
CREATE POLICY "Admin and user roles can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user', 'viewer')
  )
  WITH CHECK (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Only admin role can delete contact messages" ON public.contact_messages;
CREATE POLICY "Only admin role can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

-- Fix RLS policies for company_info table
DROP POLICY IF EXISTS "Admin and user roles can view company info" ON public.company_info;
CREATE POLICY "Admin and user roles can view company info"
  ON public.company_info
  FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user', 'viewer')
  );

DROP POLICY IF EXISTS "Admin and user roles can insert company info" ON public.company_info;
CREATE POLICY "Admin and user roles can insert company info"
  ON public.company_info
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user')
  );

DROP POLICY IF EXISTS "Admin and user roles can update company info" ON public.company_info;
CREATE POLICY "Admin and user roles can update company info"
  ON public.company_info
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user', 'viewer')
  )
  WITH CHECK (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user')
  );

-- Fix RLS policies for booking_comments table
DROP POLICY IF EXISTS "Admins can delete comments" ON public.booking_comments;
CREATE POLICY "Admins can delete comments"
  ON public.booking_comments
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

-- Fix RLS policies for booking_activity_log table
DROP POLICY IF EXISTS "Admin and user roles can view activity logs" ON public.booking_activity_log;
CREATE POLICY "Admin and user roles can view activity logs"
  ON public.booking_activity_log
  FOR SELECT
  TO authenticated
  USING (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user', 'viewer')
  );

DROP POLICY IF EXISTS "Admin and user roles can insert activity logs" ON public.booking_activity_log;
CREATE POLICY "Admin and user roles can insert activity logs"
  ON public.booking_activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()->'app_metadata'->>'role') IN ('admin', 'user')
  );