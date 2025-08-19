-- Add opportunity_type column to opportunities table
ALTER TABLE public.opportunities 
ADD COLUMN opportunity_type TEXT NOT NULL DEFAULT 'volunteer';

-- Add check constraint for valid opportunity types
ALTER TABLE public.opportunities 
ADD CONSTRAINT opportunities_type_check 
CHECK (opportunity_type IN ('volunteer', 'internship'));

-- Update existing opportunities to be volunteer type (they're all volunteer opportunities currently)
UPDATE public.opportunities 
SET opportunity_type = 'volunteer' 
WHERE opportunity_type IS NULL;