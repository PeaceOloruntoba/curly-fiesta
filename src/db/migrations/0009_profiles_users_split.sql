-- Split users.name into first_name / last_name
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Backfill first_name/last_name from existing name when present
UPDATE users
SET first_name =
      CASE WHEN name IS NULL OR name = '' THEN COALESCE(first_name, '')
           ELSE split_part(name, ' ', 1) END,
    last_name =
      CASE WHEN name IS NULL OR name = '' THEN COALESCE(last_name, '')
           ELSE NULLIF(trim(BOTH ' ' FROM substring(name FROM position(' ' IN name) + 1)), '') END
WHERE (first_name IS NULL OR last_name IS NULL);

-- Optionally drop old name column in future; keep for now to avoid breaking clients
-- ALTER TABLE users DROP COLUMN name;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  bio TEXT,
  health JSONB,
  taste JSONB,
  preferences JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
