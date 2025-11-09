/*
  # Add Product Management Policies

  This migration adds RLS policies to allow managing products through the Supabase dashboard.

  1. Security Changes
    - Add INSERT policy to allow creating new products
    - Add UPDATE policy to allow updating existing products
    - Add DELETE policy to allow deleting products
    - Update SELECT policy to allow viewing all products (not just active ones)
    
  Note: These policies allow public access for ease of management. 
  If you need authentication-based restrictions, these can be modified later.
*/

-- Drop the old restrictive select policy
DROP POLICY IF EXISTS "Anyone can view active products" ON products;

-- Policy to allow viewing all products (for management)
CREATE POLICY "Anyone can view all products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Policy to allow inserting new products
CREATE POLICY "Anyone can insert products"
  ON products
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy to allow updating products
CREATE POLICY "Anyone can update products"
  ON products
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policy to allow deleting products
CREATE POLICY "Anyone can delete products"
  ON products
  FOR DELETE
  TO public
  USING (true);
