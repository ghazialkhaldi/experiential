-- Update the organization insert policy to be more flexible for newly confirmed users
DROP POLICY IF EXISTS "Users can create their own organization" ON public.organizations;

CREATE POLICY "Users can create their own organization" 
ON public.organizations 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  auth.uid() IS NOT NULL
);

-- Also ensure the update policy doesn't have the email confirmation check
DROP POLICY IF EXISTS "Users can update their own organization" ON public.organizations;

CREATE POLICY "Users can update their own organization" 
ON public.organizations 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);