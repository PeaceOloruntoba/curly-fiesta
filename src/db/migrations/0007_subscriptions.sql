-- Subscription core schema

-- Global subscription settings (single row)
CREATE TABLE IF NOT EXISTS subscription_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  trial_days INTEGER NOT NULL DEFAULT 7,
  founder_discount_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  founder_window_starts_at TIMESTAMPTZ,
  founder_window_ends_at TIMESTAMPTZ,
  founder_capacity INTEGER NOT NULL DEFAULT 100,
  founder_discount_pct INTEGER NOT NULL DEFAULT 50,
  founder_awarded_count INTEGER NOT NULL DEFAULT 0,
  price_monthly_cents INTEGER NOT NULL DEFAULT 0,
  price_quarterly_cents INTEGER NOT NULL DEFAULT 0,
  price_biannual_cents INTEGER NOT NULL DEFAULT 0,
  price_annual_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NGN',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users table extension: founder badge
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_founder BOOLEAN NOT NULL DEFAULT FALSE;

-- User subscriptions
CREATE TYPE subscription_plan AS ENUM ('monthly','quarterly','biannual','annual');
CREATE TYPE subscription_status AS ENUM ('none','trialing','active','past_due','canceled','expired');

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL,
  status subscription_status NOT NULL DEFAULT 'none',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  gateway TEXT NOT NULL DEFAULT 'paystack',
  gateway_customer_id TEXT,
  gateway_subscription_code TEXT,
  gateway_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
