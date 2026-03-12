-- Schedule the deep daily wrap-up (mode: daily) to run at 7 AM Boston time (11 AM UTC)
-- This focusing on TLDR.ai and a full 24-hour summary
SELECT cron.schedule(
  'fetch-daily-news-daily',
  '0 11 * * *',
  $$
  SELECT net.http_post(
    url := 'https://fuantrugigewffagcyxg.supabase.co/functions/v1/fetch-daily-news',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"mode": "daily"}'::jsonb
  );
  $$
);
