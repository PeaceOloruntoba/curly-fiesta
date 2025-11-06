-- Add purpose column to distinguish OTP usage
ALTER TABLE otps ADD COLUMN IF NOT EXISTS purpose TEXT NOT NULL DEFAULT 'verify';

-- Index to speed up lookup by user and purpose
CREATE INDEX IF NOT EXISTS idx_otps_user_purpose_created ON otps(user_id, purpose, created_at DESC);
