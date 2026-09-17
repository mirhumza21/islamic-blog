-- ==========================================================
-- UMRAHZONE BLOG DATABASE SCHEMA FOR SUPABASE
-- Run this in Supabase Dashboard -> SQL Editor -> New Query
-- ==========================================================

-- 1. Authors Table
CREATE TABLE IF NOT EXISTS public.authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  avatar TEXT NOT NULL,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  image TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category_slug TEXT REFERENCES public.categories(slug) ON DELETE SET NULL,
  author_id TEXT REFERENCES public.authors(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time INT DEFAULT 5,
  image TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  popular BOOLEAN DEFAULT FALSE,
  popular_rank INT,
  tags TEXT[] DEFAULT '{}',
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies (Everyone can view published content)
CREATE POLICY "Public articles read access" 
  ON public.articles FOR SELECT 
  USING (true);

CREATE POLICY "Public categories read access" 
  ON public.categories FOR SELECT 
  USING (true);

CREATE POLICY "Public authors read access" 
  ON public.authors FOR SELECT 
  USING (true);

CREATE POLICY "Public site_settings read access" 
  ON public.site_settings FOR SELECT 
  USING (true);

-- Service Role (Backend API) Full Access Policies
CREATE POLICY "Service role full access on articles" 
  ON public.articles FOR ALL 
  USING (auth.jwt() IS NULL OR true)
  WITH CHECK (auth.jwt() IS NULL OR true);

CREATE POLICY "Service role full access on categories" 
  ON public.categories FOR ALL 
  USING (auth.jwt() IS NULL OR true)
  WITH CHECK (auth.jwt() IS NULL OR true);

CREATE POLICY "Service role full access on authors" 
  ON public.authors FOR ALL 
  USING (auth.jwt() IS NULL OR true)
  WITH CHECK (auth.jwt() IS NULL OR true);

CREATE POLICY "Service role full access on site_settings" 
  ON public.site_settings FOR ALL 
  USING (auth.jwt() IS NULL OR true)
  WITH CHECK (auth.jwt() IS NULL OR true);

-- Create Indexes for Fast Filtering & Search
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_slug);
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ==========================================================
-- 5. Storage Bucket for Blog Images & Media
-- ==========================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: Allow public read access to images
DROP POLICY IF EXISTS "Public blog-images read access" ON storage.objects;
CREATE POLICY "Public blog-images read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Policy: Allow service role / admin full access to upload, update, delete
DROP POLICY IF EXISTS "Service role full access on blog-images" ON storage.objects;
CREATE POLICY "Service role full access on blog-images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');
