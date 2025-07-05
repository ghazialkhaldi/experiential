-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  time_commitment TEXT NOT NULL,
  requirements TEXT,
  location TEXT NOT NULL,
  posted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  max_volunteers INTEGER,
  current_volunteers INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies for organizations
CREATE POLICY "Organizations can view all organizations" 
ON public.organizations 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own organization" 
ON public.organizations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organization" 
ON public.organizations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for opportunities
CREATE POLICY "Everyone can view active opportunities" 
ON public.opportunities 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Organizations can create opportunities" 
ON public.opportunities 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = organization_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Organizations can update their own opportunities" 
ON public.opportunities 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = organization_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Organizations can delete their own opportunities" 
ON public.opportunities 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = organization_id AND user_id = auth.uid()
  )
);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();