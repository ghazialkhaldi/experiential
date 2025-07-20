-- Create likes table for tracking user likes on opportunities
CREATE TABLE public.opportunity_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  opportunity_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

-- Create saved opportunities table
CREATE TABLE public.saved_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  opportunity_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

-- Enable RLS on both tables
ALTER TABLE public.opportunity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- RLS policies for opportunity_likes
CREATE POLICY "Users can view all likes" 
ON public.opportunity_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own likes" 
ON public.opportunity_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.opportunity_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for saved_opportunities
CREATE POLICY "Users can view their own saved opportunities" 
ON public.saved_opportunities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved opportunities" 
ON public.saved_opportunities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved opportunities" 
ON public.saved_opportunities 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to get like count for an opportunity
CREATE OR REPLACE FUNCTION public.get_opportunity_like_count(opportunity_id_param UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.opportunity_likes
  WHERE opportunity_id = opportunity_id_param;
$$;

-- Create function to check if user has liked an opportunity
CREATE OR REPLACE FUNCTION public.has_user_liked_opportunity(user_id_param UUID, opportunity_id_param UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.opportunity_likes
    WHERE user_id = user_id_param AND opportunity_id = opportunity_id_param
  );
$$;

-- Create function to check if user has saved an opportunity
CREATE OR REPLACE FUNCTION public.has_user_saved_opportunity(user_id_param UUID, opportunity_id_param UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.saved_opportunities
    WHERE user_id = user_id_param AND opportunity_id = opportunity_id_param
  );
$$;