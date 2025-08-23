-- Fix remaining database function security issues

CREATE OR REPLACE FUNCTION public.validate_volunteer_searcher_organization()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.notify_organization_of_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  org_user_id UUID;
  opportunity_title TEXT;
BEGIN
  -- Get the organization user ID and opportunity title
  SELECT org.user_id, opp.title
  INTO org_user_id, opportunity_title
  FROM opportunities opp
  JOIN organizations org ON opp.organization_id = org.id
  WHERE opp.id = NEW.opportunity_id;

  -- Create notification for organization
  INSERT INTO public.notifications (user_id, title, message, type, application_id, opportunity_id)
  VALUES (
    org_user_id,
    'New Application Received',
    NEW.applicant_name || ' has applied to "' || opportunity_title || '"',
    'info',
    NEW.id,
    NEW.opportunity_id
  );

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_applicant_of_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  opportunity_title TEXT;
BEGIN
  -- Only notify if status actually changed and it's not pending
  IF OLD.status != NEW.status AND NEW.status != 'pending' THEN
    -- Get opportunity title
    SELECT title INTO opportunity_title
    FROM opportunities
    WHERE id = NEW.opportunity_id;

    -- Create notification for applicant
    INSERT INTO public.notifications (user_id, title, message, type, application_id, opportunity_id)
    VALUES (
      NEW.user_id,
      'Application Status Updated',
      'Your application to "' || opportunity_title || '" has been ' || NEW.status,
      CASE 
        WHEN NEW.status = 'accepted' THEN 'success'
        WHEN NEW.status = 'rejected' THEN 'warning'
        ELSE 'info'
      END,
      NEW.id,
      NEW.opportunity_id
    );
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_applicant_on_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.notify_organization_on_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;