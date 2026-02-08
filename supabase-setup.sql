-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Create the submissions table
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_name TEXT NOT NULL,
  artist_email TEXT,
  artist_phone TEXT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  uploaded_by_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone can read approved submissions (for the public gallery)
CREATE POLICY "Public can view approved submissions"
  ON submissions
  FOR SELECT
  USING (status = 'approved');

-- 4. Policy: Anyone can insert submissions (for the submit form)
CREATE POLICY "Anyone can submit artwork"
  ON submissions
  FOR INSERT
  WITH CHECK (true);

-- 5. Policy: Service role can do everything (for admin operations)
-- Note: The service role key bypasses RLS by default, so no explicit policy needed.

-- 6. Create the storage bucket for artwork images
INSERT INTO storage.buckets (id, name, public)
VALUES ('artwork', 'artwork', true);

-- 7. Storage policy: Anyone can upload to the artwork bucket
CREATE POLICY "Anyone can upload artwork"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'artwork');

-- 8. Storage policy: Anyone can view artwork images (public bucket)
CREATE POLICY "Anyone can view artwork"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'artwork');
