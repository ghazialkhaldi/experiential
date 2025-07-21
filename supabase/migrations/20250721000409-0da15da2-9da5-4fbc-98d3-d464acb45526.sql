-- Sync existing user metadata to profiles table for users who have roles in user_metadata but no profile record
-- This is a one-time fix for users who were created before the profile sync was working properly

INSERT INTO public.profiles (id, first_name, last_name, birthday, role, age)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'first_name', ''),
  COALESCE(raw_user_meta_data->>'last_name', ''),
  CASE 
    WHEN raw_user_meta_data->>'birthday' IS NOT NULL AND raw_user_meta_data->>'birthday' != ''
    THEN (raw_user_meta_data->>'birthday')::date
    ELSE NULL
  END,
  CASE 
    WHEN raw_user_meta_data->>'role' IS NOT NULL AND raw_user_meta_data->>'role' != ''
    THEN (raw_user_meta_data->>'role')::public.user_role
    ELSE NULL
  END,
  CASE 
    WHEN raw_user_meta_data->>'age' IS NOT NULL AND raw_user_meta_data->>'age' != ''
    THEN (raw_user_meta_data->>'age')::integer
    ELSE NULL
  END
FROM auth.users 
WHERE raw_user_meta_data->>'role' IS NOT NULL 
  AND raw_user_meta_data->>'role' != ''
  AND id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;