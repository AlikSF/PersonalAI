/*
  # Add Admin Product Management Policies

  1. Security Changes
    - Add policy to allow authenticated users to insert products
    - Add policy to allow authenticated users to update products
    - Add policy to allow authenticated users to delete products
  
  2. Notes
    - These policies enable full product management for authenticated admin users
    - Public users can still view products via the existing SELECT policy
    - All authenticated users are trusted as admins (you control who can authenticate)
*/

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);
