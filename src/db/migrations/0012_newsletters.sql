-- 0012_newsletters.sql
-- Create newsletters table to store sent newsletters
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body_html TEXT NOT NULL,
  is_admin_only BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletters_created_at ON newsletters(created_at DESC);
