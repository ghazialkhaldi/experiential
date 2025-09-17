-- Add admin role to the enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'admin' 
        AND enumtypid = (
            SELECT oid FROM pg_type WHERE typname = 'user_role'
        )
    ) THEN
        ALTER TYPE public.user_role ADD VALUE 'admin';
    END IF;
END $$;

-- Create security definer functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Drop and recreate profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;

CREATE POLICY "Users can view profiles" ON public.profiles
FOR SELECT 
USING (auth.uid() = id OR public.is_admin());

-- Add admin policies for other tables
CREATE POLICY "Admins can view all applications" ON public.applications
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can view all notifications" ON public.notifications
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can view all volunteer hours" ON public.volunteer_hours
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can view all saved opportunities" ON public.saved_opportunities
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can view all opportunity likes" ON public.opportunity_likes
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can view all volunteer preferences" ON public.volunteer_preferences
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can view all subscribers" ON public.subscribers
FOR SELECT 
USING (public.is_admin());