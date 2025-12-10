/*
  # Fix Booking Comments INSERT Policy

  ## Problem
  The current policy for inserting comments only checks if the user is authenticated,
  but doesn't validate that the user_id being inserted matches the authenticated user's ID.

  ## Solution
  Replace the policy to properly check that auth.uid() matches the user_id being inserted.

  ## Security
  - Ensures users can only insert comments with their own user_id
  - Prevents impersonation attacks
*/

-- Drop the incorrect policy
DROP POLICY IF EXISTS "Authenticated users can add comments" ON booking_comments;

-- Create the correct policy that validates user_id matches auth.uid()
CREATE POLICY "Authenticated users can add comments"
  ON booking_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));
