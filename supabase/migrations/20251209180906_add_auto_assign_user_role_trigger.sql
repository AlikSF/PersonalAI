/*
  # Auto-assign User Role on Signup
  
  1. Overview
    - Automatically assigns 'user' role to new users when they sign up
    - Prevents users from having no role assigned
    - Only applies to users who don't already have a role
  
  2. Changes
    - Creates a trigger function to set default role
    - Adds a trigger on auth.users table
    - Runs before user creation to assign role
  
  3. Security
    - Only affects new users without an assigned role
    - Existing admin users remain unchanged
    - Users can be upgraded to admin manually later
*/

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_app_meta_data IS NULL OR NEW.raw_app_meta_data->>'role' IS NULL THEN
    NEW.raw_app_meta_data = COALESCE(NEW.raw_app_meta_data, '{}'::jsonb) || '{"role": "user"}'::jsonb;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();