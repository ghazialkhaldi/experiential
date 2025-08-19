-- Delete the user account and related data
-- First delete from profiles table (public schema)
DELETE FROM public.profiles WHERE id = 'af5f4299-8962-4f33-aac8-11efb9dea315';

-- Delete from volunteer_preferences if any exist
DELETE FROM public.volunteer_preferences WHERE user_id = 'af5f4299-8962-4f33-aac8-11efb9dea315';

-- Delete from applications if any exist
DELETE FROM public.applications WHERE user_id = 'af5f4299-8962-4f33-aac8-11efb9dea315';

-- Delete from saved_opportunities if any exist
DELETE FROM public.saved_opportunities WHERE user_id = 'af5f4299-8962-4f33-aac8-11efb9dea315';

-- Delete from opportunity_likes if any exist
DELETE FROM public.opportunity_likes WHERE user_id = 'af5f4299-8962-4f33-aac8-11efb9dea315';

-- Delete from volunteer_hours if any exist
DELETE FROM public.volunteer_hours WHERE user_id = 'af5f4299-8962-4f33-aac8-11efb9dea315';

-- Delete from subscribers if any exist
DELETE FROM public.subscribers WHERE user_id = 'af5f4299-8962-4f33-aac8-11efb9dea315';