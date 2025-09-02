-- Add notification_preferences column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_notification_preferences 
ON public.profiles USING GIN(notification_preferences);

-- Set default notification preferences for existing users
UPDATE public.profiles 
SET notification_preferences = '{
  "new_opportunities": true,
  "application_updates": true,
  "messages": true,
  "achievements": true,
  "reminders": true,
  "email_notifications": true,
  "push_notifications": false
}'::jsonb
WHERE notification_preferences = '{}' OR notification_preferences IS NULL;