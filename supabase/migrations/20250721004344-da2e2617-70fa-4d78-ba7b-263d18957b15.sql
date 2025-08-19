-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a daily cron job to cleanup expired opportunities at 2 AM UTC
SELECT cron.schedule(
  'cleanup-expired-opportunities-daily',
  '0 2 * * *', -- Daily at 2 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://cbylovabchsfrhmmndbn.supabase.co/functions/v1/cleanup-opportunities',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNieWxvdmFiY2hzZnJobW1uZGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODE0MDIsImV4cCI6MjA2NzE1NzQwMn0.Pp5vYSmdNrMLScMTNjeNM4duRpfOTpSjLyl57K-AmrU"}'::jsonb,
        body:='{"automated": true}'::jsonb
    ) as request_id;
  $$
);

-- Check if the cron job was created successfully
SELECT jobname, schedule FROM cron.job WHERE jobname = 'cleanup-expired-opportunities-daily';