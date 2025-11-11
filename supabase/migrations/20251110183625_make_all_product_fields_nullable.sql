/*
  # Make all product fields nullable
  
  1. Changes
    - Alter all columns in `products` table (except id) to be nullable
    - This allows creating products with minimal data and filling in details later
    - Only `id` remains required (auto-generated)
  
  2. Notes
    - Provides flexibility for incremental data entry
    - Admin can create products first and add details progressively
*/

ALTER TABLE products 
ALTER COLUMN name DROP NOT NULL,
ALTER COLUMN description DROP NOT NULL,
ALTER COLUMN category DROP NOT NULL,
ALTER COLUMN price_per_day DROP NOT NULL,
ALTER COLUMN location DROP NOT NULL,
ALTER COLUMN capacity DROP NOT NULL;