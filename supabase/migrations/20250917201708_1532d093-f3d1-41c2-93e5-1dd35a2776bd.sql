-- First, let's check and update the user_role enum to include admin
DO $$ 
BEGIN
    -- Add admin role to the enum if it doesn't exist
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

-- Create a security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Create a security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM public.profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Update profiles table RLS policies to allow admins to see all profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view profiles" ON public.profiles
FOR SELECT 
USING (
    auth.uid() = id OR public.is_admin()
);

-- Update organizations table RLS policies
DROP POLICY IF EXISTS "Authenticated users can view organizations" ON public.organizations;
CREATE POLICY "Users can view organizations" ON public.organizations
FOR SELECT 
USING (
    true OR public.is_admin()
);

-- Update applications table RLS policies  
CREATE POLICY "Admins can view all applications" ON public.applications
FOR SELECT 
USING (public.is_admin());

-- Update notifications table RLS policies
CREATE POLICY "Admins can view all notifications" ON public.notifications
FOR SELECT 
USING (public.is_admin());

-- Update volunteer_hours table RLS policies
CREATE POLICY "Admins can view all volunteer hours" ON public.volunteer_hours
FOR SELECT 
USING (public.is_admin());

-- Update saved_opportunities table RLS policies
CREATE POLICY "Admins can view all saved opportunities" ON public.saved_opportunities
FOR SELECT 
USING (public.is_admin());

-- Update opportunity_likes table RLS policies  
CREATE POLICY "Admins can view all opportunity likes" ON public.opportunity_likes
FOR SELECT 
USING (public.is_admin());

-- Update volunteer_preferences table RLS policies
CREATE POLICY "Admins can view all volunteer preferences" ON public.volunteer_preferences
FOR SELECT 
USING (public.is_admin());

-- Update subscribers table RLS policies
CREATE POLICY "Admins can view all subscribers" ON public.subscribers
FOR SELECT 
USING (public.is_admin());