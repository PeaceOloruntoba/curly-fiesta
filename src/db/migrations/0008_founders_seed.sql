-- Add founder_cycles_left to track remaining discounted billing cycles for founders
ALTER TABLE user_subscriptions
  ADD COLUMN IF NOT EXISTS founder_cycles_left INTEGER NOT NULL DEFAULT 0;

-- Mark all existing users as founders (per request)
UPDATE users SET is_founder = TRUE WHERE is_founder = FALSE;

-- Ensure a settings row exists; if your schema uses a single-row table keyed on a constant, upsert it
INSERT INTO subscription_settings (id)
VALUES (TRUE)
ON CONFLICT (id) DO NOTHING;

-- Update founder_awarded_count to match current founders
UPDATE subscription_settings
SET founder_awarded_count = (SELECT COUNT(*) FROM users WHERE is_founder = TRUE),
    updated_at = NOW()
WHERE id = TRUE;

-- Give founders 3 discounted cycles
-- For users with an existing subscription row, set founder_cycles_left = 3 if currently 0
UPDATE user_subscriptions us
SET founder_cycles_left = 3,
    updated_at = NOW()
FROM users u
WHERE us.user_id = u.id AND u.is_founder = TRUE AND COALESCE(us.founder_cycles_left, 0) = 0;

-- For founders without a subscription row, insert a placeholder row with 3 cycles
INSERT INTO user_subscriptions (user_id, plan, status, founder_cycles_left)
SELECT u.id, 'monthly'::subscription_plan, 'none'::subscription_status, 3
FROM users u
LEFT JOIN user_subscriptions us ON us.user_id = u.id
WHERE u.is_founder = TRUE AND us.user_id IS NULL;
