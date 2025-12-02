import crypto from 'crypto';
import { env } from '../config/env.js';
import { query } from '../db/pool.js';
import { AppError } from '../utils/appError.js';
import { getSettings, priceForPlanCents, applyFounderDiscountCents, markFounderIfEligible, type Plan } from './subscriptionService.js';
import { sendSubscriptionNotice } from '../utils/mailer.js';

export async function listPlans(userId: string) {
  const s = await getSettings();
  const { rows } = await query<{ email: string; is_founder: boolean; founder_cycles_left: number | null }>(
    'SELECT u.email, u.is_founder, us.founder_cycles_left FROM users u LEFT JOIN user_subscriptions us ON us.user_id=u.id WHERE u.id=$1',
    [userId]
  );
  const user = rows[0];
  const isFounder = !!user?.is_founder;
  const cycles = user?.founder_cycles_left ?? 0;
  const plans: Plan[] = ['monthly','quarterly','biannual','annual'];
  const out = plans.map((p) => {
    const base = priceForPlanCents(s, p);
    const discountedPrice = applyFounderDiscountCents(base, s, isFounder, cycles);
    return {
      plan: p,
      price_cents: discountedPrice,
      currency: s.currency,
      discounted: isFounder && s.founder_discount_enabled && cycles > 0 && discountedPrice !== base,
      discounted_price_cents: discountedPrice !== base ? discountedPrice : undefined,
    };
  });
  return { is_active: s.is_active, plans: out };
}

export async function listPublicPlans() {
  const s = await getSettings();
  const plans: Plan[] = ['monthly','quarterly','biannual','annual'];
  const out = plans.map((p) => ({
    plan: p,
    price_cents: priceForPlanCents(s, p),
    currency: s.currency,
  }));
  return { is_active: s.is_active, plans: out };
}

export async function getStatus(userId: string) {
  const s = await getSettings();
  const { rows: sub } = await query('SELECT * FROM user_subscriptions WHERE user_id=$1', [userId]);
  return { is_active: s.is_active, subscription: sub[0] || null };
}

export async function cancel(userId: string) {
  const now = new Date();
  await query("UPDATE user_subscriptions SET status='canceled', canceled_at=$2, updated_at=NOW() WHERE user_id=$1", [userId, now]);
  const { rows } = await query<{ email: string; current_period_end: string | null }>(
    'SELECT u.email, us.current_period_end FROM users u LEFT JOIN user_subscriptions us ON us.user_id=u.id WHERE u.id=$1',
    [userId]
  );
  const email = rows[0]?.email;
  const cpe = rows[0]?.current_period_end || null;
  if (email) await sendSubscriptionNotice(email, 'sub_canceled', { current_period_end: cpe });
  return { ok: true } as const;
}

export async function initCheckout(userId: string, plan: Plan) {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new AppError(503, 'Payment gateway not configured', 'Payment is temporarily unavailable');
  }
  // Mark founder if eligible
  await markFounderIfEligible(userId);
  // Gather user + pricing
  const s = await getSettings();
  const { rows: userRows } = await query<{ email: string; is_founder: boolean; founder_cycles_left: number | null }>(
    'SELECT u.email, u.is_founder, us.founder_cycles_left FROM users u LEFT JOIN user_subscriptions us ON us.user_id=u.id WHERE u.id=$1',
    [userId]
  );
  const email = userRows[0]?.email;
  if (!email) throw new AppError(400, 'User email missing', 'Cannot initialize payment');
  const base = priceForPlanCents(s, plan);
  const amountCents = applyFounderDiscountCents(base, s, !!userRows[0]?.is_founder, userRows[0]?.founder_cycles_left ?? 0);
  const amountKobo = amountCents * 1; // cents already represent kobo if currency is NGN; keep 1:1
  // Create or update pending record
  const ref = crypto.randomBytes(8).toString('hex');
  await query(
    `INSERT INTO user_subscriptions(user_id, plan, status, gateway, gateway_reference)
     VALUES($1,$2,'past_due','paystack',$3)
     ON CONFLICT (user_id) DO UPDATE SET plan=$2, status='past_due', gateway='paystack', gateway_reference=$3, updated_at=NOW()`,
    [userId, plan, ref]
  );
  // Initialize Paystack
  const callback = env.FRONTEND_BASE_URL ? `${env.FRONTEND_BASE_URL.replace(/\/$/, '')}/app/billing/processing` : undefined;
  const resp = await fetch(`${env.PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, amount: amountKobo, reference: ref, callback_url: callback }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new AppError(502, `Failed to initialize payment: ${text}`, 'Payment initialization failed');
  }
  const data = await resp.json();
  const authorization_url: string | undefined = data?.data?.authorization_url || data?.authorization_url;
  return authorization_url ? { reference: ref, authorization_url } : { reference: ref } as const;
}

export function verifyPaystackSignature(secret: string, rawBody: string, signature?: string) {
  if (!signature) return false;
  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  return hash === signature;
}

export async function handleWebhook(rawBody: string, signature?: string) {
  if (!env.PAYSTACK_SECRET_KEY) throw new AppError(503, 'Payment gateway not configured', 'Payment is temporarily unavailable');
  if (!verifyPaystackSignature(env.PAYSTACK_SECRET_KEY, rawBody, signature)) {
    throw AppError.forbidden('Invalid signature', 'Invalid webhook');
  }
  const event = JSON.parse(rawBody);
  if (event?.event === 'charge.success') {
    const customer = event?.data?.customer;
    const email = customer?.email as string | undefined;
    if (!email) return { ignored: true } as const;
    const { rows } = await query<{ id: string }>('SELECT id FROM users WHERE email=$1', [email]);
    if (!rows.length) return { ignored: true } as const;
    const userId = rows[0].id;
    const { rows: subRows } = await query<{ plan: Plan; current_period_end: string | null; trial_end: string | null }>('SELECT plan, current_period_end, trial_end FROM user_subscriptions WHERE user_id=$1', [userId]);
    const plan = subRows[0]?.plan || 'monthly';
    const now = new Date();
    const existingCpe = subRows[0]?.current_period_end ? new Date(subRows[0]!.current_period_end!) : null;
    const existingTrial = subRows[0]?.trial_end ? new Date(subRows[0]!.trial_end!) : null;
    // Stacking: start from the later of now, current_period_end, or trial_end
    let start = now;
    if (existingCpe && existingCpe > start) start = existingCpe;
    if (existingTrial && existingTrial > start) start = existingTrial;
    const end = new Date(start);
    if (plan === 'monthly') end.setMonth(end.getMonth() + 1);
    if (plan === 'quarterly') end.setMonth(end.getMonth() + 3);
    if (plan === 'biannual') end.setMonth(end.getMonth() + 6);
    if (plan === 'annual') end.setFullYear(end.getFullYear() + 1);
    await query(
      `UPDATE user_subscriptions
       SET status='active', current_period_start=$2, current_period_end=$3,
           gateway_subscription_code=$4,
           founder_cycles_left = GREATEST(COALESCE(founder_cycles_left,0) - 1, 0),
           updated_at=NOW()
       WHERE user_id=$1`,
      [userId, start, end, event?.data?.subscription_code || null]
    );
    const { rows: u } = await query<{ email: string }>('SELECT email FROM users WHERE id=$1', [userId]);
    if (u[0]?.email) await sendSubscriptionNotice(u[0].email, 'sub_active', { plan });
    return { ok: true } as const;
  }
  return { ignored: true } as const;
}
