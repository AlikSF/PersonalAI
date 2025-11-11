/*
  # Create Company Information Table

  1. New Tables
    - `company_info`
      - `id` (integer, primary key, auto-increment)
      - `name` (text) - Company name
      - `address` (text) - Full company address
      - `license_info` (text) - License or registration details
      - `insurance_info` (text) - Insurance coverage information
      - `payment_info` (text) - Payment methods description
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `company_info` table
    - Add policy for public read access (company info is public data)
    - Only authenticated users can update company info

  3. Initial Data
    - Insert default company information for PHUKETVIBE🏝

  4. Important Notes
    - Company info is publicly accessible for display on the website
    - Only admins should be able to modify this data
    - Triggers automatically update the `updated_at` timestamp
*/

-- Create company_info table
CREATE TABLE IF NOT EXISTS company_info (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  license_info TEXT NOT NULL,
  insurance_info TEXT NOT NULL,
  payment_info TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view company info)
CREATE POLICY "Anyone can view company info"
  ON company_info
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can update company info
CREATE POLICY "Authenticated users can update company info"
  ON company_info
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_company_info_updated_at ON company_info;
CREATE TRIGGER update_company_info_updated_at
  BEFORE UPDATE ON company_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default company information
INSERT INTO company_info (name, address, license_info, insurance_info, payment_info)
VALUES (
  'PHUKETVIBE🏝',
  '542/1 Patak Road, Karon, Muang, Phuket 83100',
  '📁 Лицензия TAT, 🧾 Свидетельство о регистрации компании',
  '🛡 Страховка, покрывающая все туры и гостей',
  '💳 Оплата без риска: 🌐 Онлайн — официальный обменный сервис, 💵 Наличными'
)
ON CONFLICT DO NOTHING;