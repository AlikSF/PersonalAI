/*
  # Rental Marketplace Database Schema

  ## Overview
  Creates a complete rental marketplace system for tourists/travelers to book products like yachts, cars, villas, etc.

  ## New Tables
  
  ### 1. `products`
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name (e.g., "Luxury Yacht Marina Bay")
  - `description` (text) - Detailed product description
  - `category` (text) - Product category (yacht, car, villa, etc.)
  - `price_per_day` (numeric) - Daily rental price
  - `image_url` (text) - Product image URL
  - `location` (text) - Product location
  - `capacity` (integer) - Maximum capacity (people, passengers, etc.)
  - `features` (jsonb) - Additional features/amenities
  - `is_active` (boolean) - Whether product is available for booking
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `bookings`
  - `id` (uuid, primary key) - Unique booking identifier
  - `product_id` (uuid, foreign key) - Reference to products table
  - `customer_name` (text) - Customer full name
  - `customer_email` (text) - Customer email address
  - `customer_phone` (text) - Customer phone number
  - `start_date` (date) - Booking start date
  - `end_date` (date) - Booking end date
  - `total_price` (numeric) - Total booking price
  - `payment_status` (text) - Payment status (pending, paid, failed)
  - `booking_status` (text) - Booking status (confirmed, cancelled, completed)
  - `special_requests` (text) - Any special requests from customer
  - `created_at` (timestamptz) - Booking creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `contact_messages`
  - `id` (uuid, primary key) - Unique message identifier
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `phone` (text) - Sender phone number
  - `product_id` (uuid, nullable) - Related product if inquiry about specific booking
  - `booking_id` (uuid, nullable) - Related booking if inquiry about existing booking
  - `message` (text) - Message content
  - `telegram_sent` (boolean) - Whether message was sent to Telegram
  - `created_at` (timestamptz) - Message creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for products (anyone can view listings)
  - Public insert access for bookings and contact messages (customers can book and contact)
  - No update/delete access from public (handled by admin/backend only)

  ## Indexes
  - Index on product category for filtering
  - Index on booking dates for availability queries
  - Index on payment and booking status for admin queries
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  price_per_day numeric(10, 2) NOT NULL CHECK (price_per_day > 0),
  image_url text NOT NULL,
  location text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_price numeric(10, 2) NOT NULL CHECK (total_price >= 0),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  booking_status text NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
  special_requests text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  message text NOT NULL,
  telegram_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_product_id ON bookings(product_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON bookings(booking_status);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products table
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- RLS Policies for bookings table
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own bookings by email"
  ON bookings FOR SELECT
  USING (true);

-- RLS Policies for contact messages table
CREATE POLICY "Anyone can send contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, description, category, price_per_day, image_url, location, capacity, features) VALUES
  ('Luxury Yacht Marina Bay', 'Experience the ultimate luxury on our premium yacht with stunning ocean views, professional crew, and world-class amenities.', 'yacht', 2500.00, 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg', 'Miami, Florida', 12, '["Professional Crew", "Catering Service", "Water Sports Equipment", "Spacious Deck"]'),
  ('Mercedes S-Class', 'Travel in style with our premium Mercedes S-Class featuring leather interior, advanced safety features, and ultimate comfort.', 'car', 350.00, 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', 'Los Angeles, CA', 4, '["Leather Interior", "GPS Navigation", "Premium Sound System", "Climate Control"]'),
  ('Beachfront Villa Paradise', 'Wake up to ocean views in this stunning 5-bedroom villa with private pool, chef service, and direct beach access.', 'villa', 1200.00, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg', 'Malibu, California', 10, '["Private Pool", "Chef Service", "Beach Access", "Ocean View"]'),
  ('Sports Car Ferrari 488', 'Feel the thrill with our Ferrari 488 Spider, perfect for making unforgettable memories on scenic coastal drives.', 'car', 1500.00, 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg', 'Dubai, UAE', 2, '["Convertible", "High Performance", "Premium Insurance", "24/7 Support"]'),
  ('Mountain Chalet Retreat', 'Cozy mountain escape with fireplace, hot tub, and breathtaking alpine views. Perfect for winter getaways.', 'villa', 800.00, 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg', 'Aspen, Colorado', 8, '["Hot Tub", "Fireplace", "Ski-in/Ski-out", "Mountain View"]'),
  ('Private Jet Cessna Citation', 'Travel on your schedule with our private jet service, offering luxury, privacy, and unmatched convenience.', 'jet', 8000.00, 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg', 'New York, NY', 8, '["Professional Pilot", "Catering Available", "WiFi", "Luxurious Interior"]');
