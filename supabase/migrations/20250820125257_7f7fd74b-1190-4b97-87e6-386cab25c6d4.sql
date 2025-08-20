-- Create triggers for the notification system

-- Trigger to notify organizations when someone applies
CREATE TRIGGER trigger_notify_organization_on_application
  AFTER INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_organization_on_application();

-- Trigger to notify applicants when their status changes  
CREATE TRIGGER trigger_notify_applicant_on_status_change
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_applicant_on_status_change();