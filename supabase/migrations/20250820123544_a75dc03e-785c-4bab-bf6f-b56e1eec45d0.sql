-- Create function to notify organization when someone applies
CREATE OR REPLACE FUNCTION notify_organization_on_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for the organization owner
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    application_id,
    opportunity_id
  )
  SELECT 
    org.user_id,
    'application',
    'New Application Received',
    'Someone applied to your opportunity: ' || opp.title,
    NEW.id,
    NEW.opportunity_id
  FROM opportunities opp
  JOIN organizations org ON opp.organization_id = org.id
  WHERE opp.id = NEW.opportunity_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to notify applicant when application status changes
CREATE OR REPLACE FUNCTION notify_applicant_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send notification if status actually changed and it's not pending
  IF OLD.status != NEW.status AND NEW.status != 'pending' THEN
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      application_id,
      opportunity_id
    )
    VALUES (
      NEW.user_id,
      CASE 
        WHEN NEW.status = 'accepted' THEN 'acceptance'
        WHEN NEW.status = 'rejected' THEN 'rejection'
        ELSE 'status_update'
      END,
      CASE 
        WHEN NEW.status = 'accepted' THEN 'Application Accepted!'
        WHEN NEW.status = 'rejected' THEN 'Application Update'
        ELSE 'Application Status Updated'
      END,
      CASE 
        WHEN NEW.status = 'accepted' THEN 'Congratulations! Your application has been accepted.'
        WHEN NEW.status = 'rejected' THEN 'Thank you for your interest. Your application was not selected this time.'
        ELSE 'Your application status has been updated to: ' || NEW.status
      END,
      NEW.id,
      NEW.opportunity_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_notify_organization_on_application ON applications;
CREATE TRIGGER trigger_notify_organization_on_application
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_organization_on_application();

DROP TRIGGER IF EXISTS trigger_notify_applicant_on_status_change ON applications;
CREATE TRIGGER trigger_notify_applicant_on_status_change
  AFTER UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_applicant_on_status_change();