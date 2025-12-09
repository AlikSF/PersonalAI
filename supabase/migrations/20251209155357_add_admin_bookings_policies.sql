/*
  # Add Admin Access Policies for Bookings and Contact Messages

  1. Security Changes
    - Add SELECT, UPDATE policies on bookings table for authenticated users
    - Add SELECT, UPDATE policies on contact_messages table for authenticated users
    - These policies allow admin users to view and manage all bookings and contact messages

  2. Notes
    - Only authenticated users (admins) can access these records
    - Public users can still create bookings and contact messages via existing policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view all bookings'
  ) THEN
    CREATE POLICY "Authenticated users can view all bookings"
      ON bookings
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update bookings'
  ) THEN
    CREATE POLICY "Authenticated users can update bookings"
      ON bookings
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view all contact messages'
  ) THEN
    CREATE POLICY "Authenticated users can view all contact messages"
      ON contact_messages
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update contact messages'
  ) THEN
    CREATE POLICY "Authenticated users can update contact messages"
      ON contact_messages
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;