
-- Fix the trigger function to use fully qualified type names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, birthday, role, age)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    (NEW.raw_user_meta_data->>'birthday')::date,
    (NEW.raw_user_meta_data->>'role')::public.user_role,
    CASE 
      WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'age')::integer
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;
