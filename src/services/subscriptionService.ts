import { query } from '../db/pool.js';
import { sendSubscriptionNotice } from '../utils/mailer.js';

export type SubscriptionSettings = {
  is_active: boolean;
  trial_days: number;
  founder_discount_enabled: boolean;
  founder_window_starts_at: string | null;
  founder_window_ends_at: string | null;
  founder_capacity: number;
  founder_discount_pct: number;
  founder_awarded_count: number;
  price_monthly_cents: number;
  price_quarterly_cents: number;
  price_biannual_cents: number;
  price_annual_cents: number;
  currency: string;
};

export type Plan = 'monthly' | 'quarterly' | 'biannual' | 'annual';
export type Gateway = 'paystack' | 'stripe' | 'grey';

export async function getSettings(): Promise<SubscriptionSettings> {
  const { rows } = await query<SubscriptionSettings & { id: boolean }>('SELECT * FROM subscription_settings LIMIT 1', []);
  if (rows.length) return rows[0];
  // initialize defaults if missing
  await query('INSERT INTO subscription_settings (id) VALUES (TRUE) ON CONFLICT (id) DO NOTHING');
  const { rows: r2 } = await query<SubscriptionSettings & { id: boolean }>('SELECT * FROM subscription_settings LIMIT 1', []);
  return r2[0];
}

export async function updateSettings(patch: Partial<SubscriptionSettings>) {
  const keys = Object.keys(patch) as (keyof SubscriptionSettings)[];
  if (!keys.length) return { updated: false } as const;
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const k of keys) { sets.push(`${k} = $${i++}`); params.push((patch as any)[k]); }
  await query(`UPDATE subscription_settings SET ${sets.join(', ')}, updated_at=NOW() WHERE id=TRUE`, params);
  return { updated: true } as const;
}

export async function markFounderIfEligible(userId: string): Promise<boolean> {
  const s = await getSettings();
  if (!s.founder_discount_enabled) return false;
  const now = new Date();
  const starts = s.founder_window_starts_at ? new Date(s.founder_window_starts_at) : null;
  const ends = s.founder_window_ends_at ? new Date(s.founder_window_ends_at) : null;
  if (!starts || !ends || now < starts || now > ends) return false;
  if (s.founder_awarded_count >= s.founder_capacity) return false;
  // try to mark user as founder
  const upd = await query<{ ok: number }>('UPDATE users SET is_founder=TRUE WHERE id=$1 AND is_founder=FALSE RETURNING 1 as ok', [userId]);
  if (upd.rows && upd.rows.length) {
    await query('UPDATE subscription_settings SET founder_awarded_count = founder_awarded_count + 1, updated_at=NOW() WHERE id=TRUE');
    return true;
  }
  return false;
}

export function priceForPlanCents(s: SubscriptionSettings, plan: Plan): number {
  switch (plan) {
    case 'monthly': return s.price_monthly_cents;
    case 'quarterly': return s.price_quarterly_cents;
    case 'biannual': return s.price_biannual_cents;
    case 'annual': return s.price_annual_cents;
  }
}

export async function getUserSubscription(userId: string) {
  const { rows } = await query('SELECT * FROM user_subscriptions WHERE user_id=$1', [userId]);
  return rows[0] || null;
}

export async function startTrialIfNeeded(userId: string) {
  const s = await getSettings();
  const existing = await getUserSubscription(userId);
  if (existing && existing.status !== 'none') return existing;
  const trialEnd = new Date(Date.now() + s.trial_days * 24 * 60 * 60 * 1000);
  await query(
    `INSERT INTO user_subscriptions(user_id, plan, status, trial_end)
     VALUES($1,'monthly','trialing',$2)
     ON CONFLICT (user_id) DO UPDATE SET status='trialing', trial_end=$2, updated_at=NOW()`,
    [userId, trialEnd]
  );
  const { rows } = await query<{ email: string }>('SELECT email FROM users WHERE id=$1', [userId]);
  if (rows[0]?.email) await sendSubscriptionNotice(rows[0].email, 'trial_started', { trial_days: s.trial_days });
  return getUserSubscription(userId);
}

export async function requireActiveOrTrial(userId: string): Promise<{ ok: boolean; reason?: string }> {
  const s = await getSettings();
  if (!s.is_active) return { ok: true };
  const sub = await getUserSubscription(userId);
  const now = new Date();
  if (sub?.status === 'active' && sub.current_period_end && new Date(sub.current_period_end) > now) return { ok: true };
  if (sub?.status === 'trialing' && sub.trial_end && new Date(sub.trial_end) > now) return { ok: true };
  return { ok: false, reason: 'Subscription required' };
}

export function applyFounderDiscountCents(amountCents: number, s: SubscriptionSettings, isFounder: boolean): number {
  if (isFounder && s.founder_discount_enabled) {
    return Math.floor(amountCents * (100 - s.founder_discount_pct) / 100);
  }
  return amountCents;
}
