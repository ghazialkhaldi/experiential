-- Add category field to organizations table
ALTER TABLE public.organizations 
ADD COLUMN category TEXT;