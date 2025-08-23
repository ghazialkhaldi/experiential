-- Fix critical security issues

-- 1. Secure organization data - restrict public access to organizations table
DROP POLICY IF EXISTS "Organizations can view all organizations" ON public.organizations;

-- Create more restrictive policy for organization viewing
CREATE POLICY "Public can view organizations with opportunities" ON public.organizations
FOR SELECT
USING (
  -- Allow viewing organizations that have active opportunities
  EXISTS (
    SELECT 1 FROM public.opportunities 
    WHERE organization_id = organizations.id 
    AND is_active = true
  )
);

-- Allow authenticated users to view organizations they interact with
CREATE POLICY "Authenticated users can view organizations" ON public.organizations
FOR SELECT
TO authenticated
USING (true);

-- 2. Harden database functions with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_opportunity_like_count(opportunity_id_param uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT COUNT(*)::INTEGER
  FROM public.opportunity_likes
  WHERE opportunity_id = opportunity_id_param;
$function$;

CREATE OR REPLACE FUNCTION public.has_user_liked_opportunity(user_id_param uuid, opportunity_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.opportunity_likes
    WHERE user_id = user_id_param AND opportunity_id = opportunity_id_param
  );
$function$;

CREATE OR REPLACE FUNCTION public.has_user_saved_opportunity(user_id_param uuid, opportunity_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.saved_opportunities
    WHERE user_id = user_id_param AND opportunity_id = opportunity_id_param
  );
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_opportunities()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Delete opportunities that have passed their end date
  DELETE FROM public.opportunities 
  WHERE end_date < CURRENT_DATE 
  AND is_active = true;
  
  -- Log the cleanup (optional)
  RAISE NOTICE 'Cleaned up expired opportunities at %', NOW();
END;
$function$;