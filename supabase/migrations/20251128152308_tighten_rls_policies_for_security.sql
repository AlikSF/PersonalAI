/*
  # Tighten RLS Policies for Production Security

  This migration tightens Row Level Security policies to prevent unauthorized data manipulation
  while maintaining necessary public access for website functionality.

  ## Changes Made

  ### 1. Products Table
  - **REMOVED**: Public INSERT, UPDATE, DELETE policies
  - **KEPT**: Public SELECT policy (read-only access for website)
  - **Result**: Anonymous users can only view products, not modify them
  - **Admin Access**: Direct Supabase access still works (bypasses RLS)

  ### 2. Bookings Table
  - **REMOVED**: Public SELECT policy (prevents viewing other users' bookings)
  - **KEPT**: Public INSERT policy (allows users to create bookings)
  - **Result**: Anonymous users can create bookings but cannot view, update, or delete them

  ### 3. Contact Messages Table
  - **REMOVED**: Public SELECT policy (prevents viewing other users' messages)
  - **KEPT**: Public INSERT policy (allows users to send messages)
  - **Result**: Anonymous users can send messages but cannot view, update, or delete them

  ### 4. Company Info Table
  - **NO CHANGES**: Policies remain as-is
  - Public SELECT: Allows website to display company information
  - Authenticated UPDATE: Allows authorized updates only

  ## Security Improvements
  - Prevents anonymous users from modifying product data
  - Protects user privacy by preventing access to bookings and messages
  - Maintains website functionality for public users
  - Admin access via Supabase dashboard unaffected
*/

-- ============================================================================
-- PRODUCTS TABLE: Remove public write access, keep read access
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

-- Verify the SELECT policy exists (should already exist)
-- This allows the website to display products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' 
    AND policyname = 'Anyone can view all products'
  ) THEN
    CREATE POLICY "Anyone can view all products"
      ON products
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- ============================================================================
-- BOOKINGS TABLE: Keep INSERT, remove SELECT
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view bookings" ON bookings;

-- Verify the INSERT policy exists (should already exist)
-- This allows users to create bookings from the website
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Anyone can create bookings'
  ) THEN
    CREATE POLICY "Anyone can create bookings"
      ON bookings
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- CONTACT_MESSAGES TABLE: Keep INSERT, remove SELECT
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view contact messages" ON contact_messages;

-- Verify the INSERT policy exists (should already exist)
-- This allows users to send contact messages from the website
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Anyone can send contact messages'
  ) THEN
    CREATE POLICY "Anyone can send contact messages"
      ON contact_messages
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- Verification: Check final policies
-- ============================================================================

-- This comment documents the expected final state:
-- 
-- products:
--   - SELECT (public) ✓
--
-- bookings:
--   - INSERT (public) ✓
--
-- contact_messages:
--   - INSERT (public) ✓
--
-- company_info:
--   - SELECT (public) ✓
--   - UPDATE (authenticated) ✓
