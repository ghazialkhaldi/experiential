-- Security fix: admin role escalation.
--
-- 1. The "Users can update their own profile" policy lets any signed-in user
--    set profiles.role = 'admin' on their own row through the API.
-- 2. handle_new_user() copies role from sign-up metadata, which the client
--    controls, so signUp({ options: { data: { role: 'admin' } } }) also works.
--
-- Either path grants read access to every user's data via is_admin().
-- This trigger limits self-service roles to the two account types. Only an
-- existing admin, the service role, or direct SQL can grant or remove admin.

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Profiles created by the sign-up trigger: never trust a metadata 'admin'.
  -- Downgrade to NULL so the user completes setup and picks a real role.
  IF TG_OP = 'INSERT' AND session_user = 'supabase_auth_admin' THEN
    IF NEW.role = 'admin' THEN
      NEW.role := NULL;
    END IF;
    RETURN NEW;
  END IF;

  -- Service role (edge functions) and direct SQL sessions are trusted.
  IF coalesce(auth.jwt() ->> 'role', '') = 'service_role'
     OR session_user NOT IN ('authenticator', 'supabase_auth_admin') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.role = 'admin' THEN
      RAISE EXCEPTION 'Not allowed to create an admin profile';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role
     AND (NEW.role = 'admin' OR OLD.role = 'admin')
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not allowed to change admin role';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_role_escalation ON public.profiles;
CREATE TRIGGER prevent_role_escalation
  BEFORE INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();
