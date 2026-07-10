-- Create doubt_replies table
CREATE TABLE IF NOT EXISTS public.doubt_replies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  doubt_id text REFERENCES public.doubts(id) ON DELETE CASCADE NOT NULL,
  professor_id uuid NOT NULL, -- normally references auth.users
  reply_text text,
  image_urls text[] DEFAULT '{}',
  video_urls text[] DEFAULT '{}',
  audio_urls text[] DEFAULT '{}',
  attachment_urls text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  is_edited boolean DEFAULT false NOT NULL,
  reply_order integer DEFAULT 0 NOT NULL
);

-- Enable RLS
ALTER TABLE public.doubt_replies ENABLE ROW LEVEL SECURITY;

-- Policies for doubt_replies
CREATE POLICY "Public can view doubt_replies" ON public.doubt_replies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert doubt_replies" ON public.doubt_replies
  FOR INSERT WITH CHECK (true); -- Ideally restrict to authenticated professors

CREATE POLICY "Authenticated users can update doubt_replies" ON public.doubt_replies
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete doubt_replies" ON public.doubt_replies
  FOR DELETE USING (true);

-- Ensure storage buckets exist
INSERT INTO storage.buckets (id, name, public) VALUES ('doubts', 'doubts', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for storage
CREATE POLICY "Public can view doubts bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'doubts');

CREATE POLICY "Authenticated users can upload to doubts bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'doubts');

CREATE POLICY "Authenticated users can update doubts bucket" ON storage.objects
  FOR UPDATE USING (bucket_id = 'doubts');

CREATE POLICY "Authenticated users can delete from doubts bucket" ON storage.objects
  FOR DELETE USING (bucket_id = 'doubts');
