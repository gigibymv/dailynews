-- Create daily briefings table
CREATE TABLE public.daily_briefings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_briefings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read daily briefings" ON public.daily_briefings FOR SELECT USING (true);

-- Service role can manage
CREATE POLICY "Service role can manage daily briefings" ON public.daily_briefings FOR ALL USING (auth.role() = 'service_role');

-- Index for date
CREATE INDEX idx_briefing_published_date ON public.daily_briefings (published_date DESC);

-- Update trigger
CREATE TRIGGER update_daily_briefings_updated_at BEFORE UPDATE ON public.daily_briefings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
