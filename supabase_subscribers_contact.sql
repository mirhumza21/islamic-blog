-- ==========================================================
-- Subscribers + Contact Messages
-- Run in Supabase Dashboard -> SQL Editor
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT DEFAULT 'newsletter',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_email_lower
  ON public.subscribers (lower(email));

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created
  ON public.contact_messages (created_at DESC);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on subscribers" ON public.subscribers;
CREATE POLICY "Service role full access on subscribers"
  ON public.subscribers FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on contact_messages" ON public.contact_messages;
CREATE POLICY "Service role full access on contact_messages"
  ON public.contact_messages FOR ALL
  USING (true)
  WITH CHECK (true);
