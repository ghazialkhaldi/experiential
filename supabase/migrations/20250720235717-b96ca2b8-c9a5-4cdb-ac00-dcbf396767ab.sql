-- Add foreign key constraints
ALTER TABLE public.opportunity_likes 
ADD CONSTRAINT fk_opportunity_likes_opportunity 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.saved_opportunities 
ADD CONSTRAINT fk_saved_opportunities_opportunity 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;