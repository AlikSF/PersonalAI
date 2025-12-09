/*
  # Restrict delete operations to admins only

  1. Updated RLS Policies
    - Products: Only admins can delete
    - Bookings: Only admins can delete
    - Contact Messages: Only admins can delete
  
  2. Security
    - DELETE policies check for admin role in auth.jwt()
    - Prevents non-admin users from deleting data
    - Other operations (SELECT, INSERT, UPDATE) remain unchanged
*/

DROP POLICY IF EXISTS "Admin can delete products" ON products;
DROP POLICY IF EXISTS "Admin can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can delete contact messages" ON contact_messages;

CREATE POLICY "Admin can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role') = 'admin');

CREATE POLICY "Admin can delete bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role') = 'admin');

CREATE POLICY "Admin can delete contact messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role') = 'admin');