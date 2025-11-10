/*
  # Fix Security and Performance Issues

  1. Indexes
    - Add missing indexes for foreign keys in `contact_messages` table
      - `booking_id` foreign key index
      - `product_id` foreign key index
    - Remove unused indexes that are not being utilized:
      - `idx_products_category` on products table
      - `idx_products_is_active` on products table
      - `idx_bookings_dates` on bookings table
      - `idx_bookings_payment_status` on bookings table
      - `idx_bookings_booking_status` on bookings table

  2. Security
    - Fix mutable search_path in `update_updated_at_column` function by setting explicit search_path
    
  3. Important Notes
    - Foreign key indexes improve JOIN performance and prevent table locks
    - Removing unused indexes reduces write overhead and storage
    - Fixing search_path prevents potential security vulnerabilities
*/

-- Add missing foreign key indexes for contact_messages table
CREATE INDEX IF NOT EXISTS idx_contact_messages_booking_id 
  ON contact_messages(booking_id);

CREATE INDEX IF NOT EXISTS idx_contact_messages_product_id 
  ON contact_messages(product_id);

-- Remove unused indexes to improve write performance
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_is_active;
DROP INDEX IF EXISTS idx_bookings_dates;
DROP INDEX IF EXISTS idx_bookings_payment_status;
DROP INDEX IF EXISTS idx_bookings_booking_status;

-- Fix the update_updated_at_column function to have immutable search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers that may have been dropped
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();