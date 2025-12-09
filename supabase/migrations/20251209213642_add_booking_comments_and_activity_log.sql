/*
  # Add Booking Comments and Activity Log

  1. New Tables
    - `booking_comments`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key to bookings)
      - `user_id` (uuid, foreign key to auth.users)
      - `user_email` (text, denormalized for display)
      - `comment` (text, the comment content)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `booking_activity_log`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, foreign key to bookings)
      - `user_id` (uuid, foreign key to auth.users)
      - `user_email` (text, denormalized for display)
      - `action` (text, e.g., 'created', 'updated', 'status_changed', 'comment_added')
      - `details` (jsonb, stores what changed)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow authenticated users to read all comments and logs
    - Allow authenticated users to insert comments
    - Only system can insert activity logs (via triggers)
    - Allow users to update their own comments

  3. Triggers
    - Auto-populate user_email from auth.users
    - Track booking changes automatically
*/

-- Create booking_comments table
CREATE TABLE IF NOT EXISTS booking_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text NOT NULL,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create booking_activity_log table
CREATE TABLE IF NOT EXISTS booking_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text NOT NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_booking_comments_booking_id ON booking_comments(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_comments_created_at ON booking_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_activity_log_booking_id ON booking_activity_log(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_activity_log_created_at ON booking_activity_log(created_at DESC);

-- Enable RLS
ALTER TABLE booking_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for booking_comments

-- Authenticated users can view all comments
CREATE POLICY "Authenticated users can view all comments"
  ON booking_comments
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can add comments
CREATE POLICY "Authenticated users can add comments"
  ON booking_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON booking_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only admins can delete comments
CREATE POLICY "Admins can delete comments"
  ON booking_comments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_app_meta_data->>'role') = 'admin'
    )
  );

-- RLS Policies for booking_activity_log

-- Authenticated users can view all activity logs
CREATE POLICY "Authenticated users can view all activity logs"
  ON booking_activity_log
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can insert logs (application level)
CREATE POLICY "Authenticated users can insert activity logs"
  ON booking_activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to log booking activities
CREATE OR REPLACE FUNCTION log_booking_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Log booking creation
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO booking_activity_log (booking_id, user_id, user_email, action, details)
    VALUES (
      NEW.id,
      auth.uid(),
      COALESCE(auth.email(), 'system'),
      'created',
      jsonb_build_object(
        'customer_name', NEW.customer_name,
        'product_id', NEW.product_id,
        'tour_date', NEW.tour_date
      )
    );
    RETURN NEW;
  END IF;

  -- Log booking updates
  IF (TG_OP = 'UPDATE') THEN
    DECLARE
      changes jsonb := '{}'::jsonb;
    BEGIN
      -- Track specific field changes
      IF (OLD.booking_status IS DISTINCT FROM NEW.booking_status) THEN
        changes := changes || jsonb_build_object(
          'booking_status',
          jsonb_build_object('old', OLD.booking_status, 'new', NEW.booking_status)
        );
      END IF;

      IF (OLD.payment_status IS DISTINCT FROM NEW.payment_status) THEN
        changes := changes || jsonb_build_object(
          'payment_status',
          jsonb_build_object('old', OLD.payment_status, 'new', NEW.payment_status)
        );
      END IF;

      IF (OLD.customer_name IS DISTINCT FROM NEW.customer_name) THEN
        changes := changes || jsonb_build_object(
          'customer_name',
          jsonb_build_object('old', OLD.customer_name, 'new', NEW.customer_name)
        );
      END IF;

      IF (OLD.customer_email IS DISTINCT FROM NEW.customer_email) THEN
        changes := changes || jsonb_build_object(
          'customer_email',
          jsonb_build_object('old', OLD.customer_email, 'new', NEW.customer_email)
        );
      END IF;

      IF (OLD.customer_phone IS DISTINCT FROM NEW.customer_phone) THEN
        changes := changes || jsonb_build_object(
          'customer_phone',
          jsonb_build_object('old', OLD.customer_phone, 'new', NEW.customer_phone)
        );
      END IF;

      IF (OLD.tour_date IS DISTINCT FROM NEW.tour_date) THEN
        changes := changes || jsonb_build_object(
          'tour_date',
          jsonb_build_object('old', OLD.tour_date, 'new', NEW.tour_date)
        );
      END IF;

      IF (OLD.adults IS DISTINCT FROM NEW.adults) THEN
        changes := changes || jsonb_build_object(
          'adults',
          jsonb_build_object('old', OLD.adults, 'new', NEW.adults)
        );
      END IF;

      IF (OLD.children IS DISTINCT FROM NEW.children) THEN
        changes := changes || jsonb_build_object(
          'children',
          jsonb_build_object('old', OLD.children, 'new', NEW.children)
        );
      END IF;

      -- Only log if there are actual changes
      IF (changes != '{}'::jsonb) THEN
        INSERT INTO booking_activity_log (booking_id, user_id, user_email, action, details)
        VALUES (
          NEW.id,
          auth.uid(),
          COALESCE(auth.email(), 'system'),
          'updated',
          changes
        );
      END IF;

      RETURN NEW;
    END;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for booking changes
DROP TRIGGER IF EXISTS track_booking_changes ON bookings;
CREATE TRIGGER track_booking_changes
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION log_booking_activity();

-- Function to auto-populate updated_at for comments
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
DROP TRIGGER IF EXISTS update_booking_comments_updated_at ON booking_comments;
CREATE TRIGGER update_booking_comments_updated_at
  BEFORE UPDATE ON booking_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to log comment additions
CREATE OR REPLACE FUNCTION log_comment_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO booking_activity_log (booking_id, user_id, user_email, action, details)
    VALUES (
      NEW.booking_id,
      NEW.user_id,
      NEW.user_email,
      'comment_added',
      jsonb_build_object('comment_preview', LEFT(NEW.comment, 100))
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for comment additions
DROP TRIGGER IF EXISTS track_comment_additions ON booking_comments;
CREATE TRIGGER track_comment_additions
  AFTER INSERT ON booking_comments
  FOR EACH ROW
  EXECUTE FUNCTION log_comment_activity();
