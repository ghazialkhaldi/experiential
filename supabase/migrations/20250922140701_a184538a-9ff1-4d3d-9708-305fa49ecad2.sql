-- Function to update volunteer count when application status changes
CREATE OR REPLACE FUNCTION public.update_volunteer_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If status changed to accepted, increment count
  IF OLD.status != 'accepted' AND NEW.status = 'accepted' THEN
    UPDATE public.opportunities 
    SET current_volunteers = COALESCE(current_volunteers, 0) + 1
    WHERE id = NEW.opportunity_id;
  END IF;
  
  -- If status changed from accepted to something else, decrement count
  IF OLD.status = 'accepted' AND NEW.status != 'accepted' THEN
    UPDATE public.opportunities 
    SET current_volunteers = GREATEST(COALESCE(current_volunteers, 0) - 1, 0)
    WHERE id = NEW.opportunity_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for application status updates
CREATE TRIGGER update_volunteer_count_on_status_change
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.update_volunteer_count();