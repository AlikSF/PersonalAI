/*
  # Make customer_phone field optional in bookings table

  1. Changes
    - Alter the `customer_phone` column in `bookings` table to allow NULL values
    - This allows customers to submit bookings without providing a phone number

  2. Reasoning
    - Some customers prefer not to share their phone numbers
    - Contact can still be made through the selected platform (Telegram/WhatsApp)
    - Improves user experience by reducing friction in the booking process
*/

-- Make customer_phone nullable
DO $$
BEGIN
  ALTER TABLE bookings ALTER COLUMN customer_phone DROP NOT NULL;
END $$;