-- Enable necessary extensions for HTTP requests and scheduling
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the news refresh to run every hour at minute 0
-- This calls the edge function automatically to keep the feed fresh
SELECT cron.schedule(
  'fetch-daily-news-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://fuantrugigewffagcyxg.supabase.co/functions/v1/fetch-daily-news',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
