-- Add unique constraints to allow upsert logic
ALTER TABLE public.news_articles ADD CONSTRAINT news_articles_url_key UNIQUE (url);
ALTER TABLE public.tldr_items ADD CONSTRAINT tldr_items_url_key UNIQUE (url);
-- For community posts, some might not have URLs or might use the same URL for different posts, 
-- but title + author + source is usually unique. However, if URL is reliable, we can use it.
ALTER TABLE public.community_posts ADD CONSTRAINT community_posts_url_key UNIQUE (url);

-- Ensure daily_briefings is unique per date
ALTER TABLE public.daily_briefings ADD CONSTRAINT daily_briefings_published_date_key UNIQUE (published_date);
