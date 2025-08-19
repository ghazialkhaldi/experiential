-- Add unique constraint to prevent multiple organizations per user
ALTER TABLE public.organizations ADD CONSTRAINT unique_user_organization UNIQUE (user_id);

-- Add constraint to ensure volunteer_searcher users have organizations
-- We'll use a trigger instead of CHECK constraint for better flexibility

-- Create function to validate volunteer searcher organization requirements
CREATE OR REPLACE FUNCTION public.validate_volunteer_searcher_organization()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user with volunteer_searcher role is trying to create opportunities without organization
  IF TG_TABLE_NAME = 'opportunities' THEN
    -- This is for opportunities table - ensure organization exists for the user
    IF NOT EXISTS (
      SELECT 1 FROM public.organizations 
      WHERE id = NEW.organization_id
    ) THEN
      RAISE EXCEPTION 'Organization must exist to post opportunities';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to opportunities table to validate organization exists
CREATE TRIGGER validate_opportunity_organization
  BEFORE INSERT ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.validate_volunteer_searcher_organization();

-- Add index for better performance on organization lookups by user_id
CREATE INDEX IF NOT EXISTS idx_organizations_user_id ON public.organizations(user_id);

-- Add index for better performance on opportunity lookups by organization_id  
CREATE INDEX IF NOT EXISTS idx_opportunities_organization_id ON public.opportunities(organization_id);