-- Add start and end dates to opportunities table
ALTER TABLE public.opportunities 
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE;

-- Update existing opportunities to have reasonable defaults
UPDATE public.opportunities 
SET 
  start_date = CURRENT_DATE,
  end_date = CURRENT_DATE + INTERVAL '30 days'
WHERE start_date IS NULL OR end_date IS NULL;

-- Create index for efficient cleanup queries
CREATE INDEX idx_opportunities_end_date ON public.opportunities(end_date);

-- Create function to cleanup expired opportunities
CREATE OR REPLACE FUNCTION public.cleanup_expired_opportunities()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete opportunities that have passed their end date
  DELETE FROM public.opportunities 
  WHERE end_date < CURRENT_DATE 
  AND is_active = true;
  
  -- Log the cleanup (optional)
  RAISE NOTICE 'Cleaned up expired opportunities at %', NOW();
END;
$$;