-- Check if notifications table exists and create if it doesn't
-- First, let's check the current structure
DO $$
BEGIN
    -- Create notifications table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications' AND table_schema = 'public') THEN
        CREATE TABLE public.notifications (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            type TEXT NOT NULL DEFAULT 'info',
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN NOT NULL DEFAULT false,
            application_id UUID,
            opportunity_id UUID,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        -- Enable RLS
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view their own notifications"
        ON public.notifications
        FOR SELECT
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own notifications"
        ON public.notifications
        FOR UPDATE
        USING (auth.uid() = user_id);
        
        -- System can insert notifications for users
        CREATE POLICY "System can insert notifications"
        ON public.notifications
        FOR INSERT
        WITH CHECK (true);
        
        -- Create indexes for better performance
        CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
        CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);
        CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
        
        -- Add trigger for updated_at
        CREATE TRIGGER update_notifications_updated_at
        BEFORE UPDATE ON public.notifications
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
        
        RAISE NOTICE 'Notifications table created successfully';
    ELSE
        RAISE NOTICE 'Notifications table already exists';
    END IF;
END $$;

-- Enable real-time for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add table to realtime publication
DO $$
BEGIN
    -- Add to supabase_realtime publication if not already added
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
        RAISE NOTICE 'Added notifications table to realtime publication';
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE 'Notifications table already in realtime publication';
    END;
END $$;

-- Create function to send notification
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_application_id UUID DEFAULT NULL,
    p_opportunity_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        application_id,
        opportunity_id
    )
    VALUES (
        p_user_id,
        p_type,
        p_title,
        p_message,
        p_application_id,
        p_opportunity_id
    )
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$;

-- Create function to send welcome notification for new users
CREATE OR REPLACE FUNCTION public.create_welcome_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Create welcome notification for new user
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (
        NEW.id,
        'welcome',
        'Welcome to Experiential!',
        'Get started by exploring opportunities and building your profile.'
    );
    
    RETURN NEW;
END;
$function$;

-- Create trigger for welcome notifications
DROP TRIGGER IF EXISTS create_welcome_notification_trigger ON public.profiles;
CREATE TRIGGER create_welcome_notification_trigger
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.create_welcome_notification();

-- Create function to notify about new opportunities based on user preferences
CREATE OR REPLACE FUNCTION public.notify_users_of_new_opportunity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Only notify for active opportunities
    IF NEW.is_active = true THEN
        -- Insert notifications for all users (they can filter by preferences on frontend)
        INSERT INTO public.notifications (user_id, type, title, message, opportunity_id)
        SELECT 
            p.id,
            'new_opportunity',
            CASE 
                WHEN NEW.opportunity_type = 'internship' THEN 'New Internship Available!'
                ELSE 'New Volunteer Opportunity Available!'
            END,
            'Check out this new opportunity: ' || NEW.title,
            NEW.id
        FROM public.profiles p
        WHERE p.role = 'volunteer_searcher' OR p.role IS NULL;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Create trigger for new opportunity notifications
DROP TRIGGER IF EXISTS notify_new_opportunity_trigger ON public.opportunities;
CREATE TRIGGER notify_new_opportunity_trigger
    AFTER INSERT ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_users_of_new_opportunity();