-- Fix security vulnerability in subscribers table RLS policies

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure INSERT policy - only authenticated users can create their own subscription records
CREATE POLICY "authenticated_users_can_insert_own_subscription" ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR 
  auth.email() = email
);

-- Create secure UPDATE policy - users can only update their own subscription records
CREATE POLICY "users_can_update_own_subscription" ON public.subscribers
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR 
  auth.email() = email
);

-- Create system policy for edge functions using service role (bypasses RLS automatically)
-- This allows edge functions to update subscription data as needed for Stripe integration
CREATE POLICY "service_role_can_update_subscriptions" ON public.subscribers
FOR UPDATE
TO service_role
USING (true);

-- Create system policy for edge functions to insert subscription data
CREATE POLICY "service_role_can_insert_subscriptions" ON public.subscribers
FOR INSERT
TO service_role
WITH CHECK (true);