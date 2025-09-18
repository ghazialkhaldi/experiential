-- Add email column to existing profiles table
ALTER TABLE public.profiles ADD COLUMN email text;

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  -- Only insert profile if we have minimum required data (first_name, last_name, birthday)
  -- For Google users or users missing required fields, create a minimal profile that can be completed later
  INSERT INTO public.profiles (id, email, first_name, last_name, birthday, role, age)
  VALUES (
    NEW.id,
    NEW.email, -- Add email from auth.users
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)), -- fallback to email prefix
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''), -- empty string if missing
    COALESCE((NEW.raw_user_meta_data->>'birthday')::date, '1990-01-01'::date), -- default date if missing
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, null), -- null role means profile needs completion
    CASE 
      WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL AND NEW.raw_user_meta_data->>'age' != ''
      THEN (NEW.raw_user_meta_data->>'age')::integer
      ELSE NULL
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    -- Try to create a minimal profile to prevent login issues
    BEGIN
      INSERT INTO public.profiles (id, email, first_name, last_name, birthday, role, age)
      VALUES (
        NEW.id,
        NEW.email,
        split_part(NEW.email, '@', 1), -- email prefix as first name
        '', -- empty last name
        '1990-01-01'::date, -- default birthday
        null, -- null role indicates profile needs completion
        null -- no age
      );
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Failed to create minimal profile for user %: %', NEW.id, SQLERRM;
    END;
    RETURN NEW;
END;
$$;