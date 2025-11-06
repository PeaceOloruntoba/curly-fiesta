import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../db/pool.js';
import { signToken } from '../utils/jwt.js';
import { generateOtp } from '../utils/otp.js';
import { env } from '../config/env.js';
import { sendOtpEmail, sendResetEmail } from '../utils/mailer.js';
import { logger } from '../config/logger.js';

export async function registerUser(email: string, password: string, name?: string) {
  const { rows: existing } = await query<{ id: string }>('SELECT id FROM users WHERE email=$1', [email]);
  if (existing.length) return { conflict: true } as const;
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await query<{ id: string }>(
    'INSERT INTO users(email, password_hash, name) VALUES($1,$2,$3) RETURNING id',
    [email, hash, name || null]
  );
  const userId = rows[0].id;
  const code = generateOtp();
  const ttlMin = parseInt(env.OTP_TTL_MINUTES, 10) || 10;
  const expires = new Date(Date.now() + ttlMin * 60_000);
  await query('INSERT INTO otps(user_id, code, expires_at, purpose) VALUES($1,$2,$3,$4)', [userId, code, expires, 'verify']);
  await sendOtpEmail(email, code);
  logger.info({ email }, 'User registered and OTP sent');
  return { userId, code } as const;
}

export async function verifyEmailOtp(email: string, code: string) {
  const { rows: users } = await query<{ id: string; verified_at: string | null }>('SELECT id, verified_at FROM users WHERE email=$1', [email]);
  if (!users.length) return { notFound: true } as const;
  const userId = users[0].id;
  const { rows: otps } = await query<{ id: string; expires_at: string; used: boolean }>(
    'SELECT id, expires_at, used FROM otps WHERE user_id=$1 AND code=$2 AND purpose=$3 ORDER BY created_at DESC LIMIT 1',
    [userId, code, 'verify']
  );
  if (!otps.length) return { invalid: true } as const;
  const otp = otps[0];
  if (otp.used) return { used: true } as const;
  if (new Date(otp.expires_at) < new Date()) return { expired: true } as const;
  await query('UPDATE users SET verified_at=NOW() WHERE id=$1', [userId]);
  await query('UPDATE otps SET used=true WHERE id=$1', [otp.id]);
  logger.info({ email }, 'Email OTP verified');
  return { ok: true } as const;
}

export async function loginUser(email: string, password: string) {
  const { rows } = await query<{ id: string; password_hash: string; verified_at: string | null }>(
    'SELECT id, password_hash, verified_at FROM users WHERE email=$1',
    [email]
  );
  if (!rows.length) return { invalid: true } as const;
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return { invalid: true } as const;
  if (!user.verified_at) return { unverified: true } as const;
  const token = signToken({ sub: user.id, email });
  const rt = crypto.randomBytes(32).toString('hex');
  const rtExpires = new Date(Date.now() + 30 * 24 * 60 * 60_000);
  await query('INSERT INTO refresh_tokens(user_id, token, expires_at) VALUES($1,$2,$3)', [user.id, rt, rtExpires]);
  return { token, rt, rtExpires, userId: user.id } as const;
}

export async function refreshAccessToken(rt: string) {
  const { rows } = await query<{ user_id: string; expires_at: string }>('SELECT user_id, expires_at FROM refresh_tokens WHERE token=$1', [rt]);
  if (!rows.length) return { invalid: true } as const;
  const rec = rows[0];
  if (new Date(rec.expires_at) < new Date()) return { expired: true } as const;
  await query('DELETE FROM refresh_tokens WHERE token=$1', [rt]);
  const newRt = crypto.randomBytes(32).toString('hex');
  const rtExpires = new Date(Date.now() + 30 * 24 * 60 * 60_000);
  await query('INSERT INTO refresh_tokens(user_id, token, expires_at) VALUES($1,$2,$3)', [rec.user_id, newRt, rtExpires]);
  const { rows: u } = await query<{ email: string }>('SELECT email FROM users WHERE id=$1', [rec.user_id]);
  const access = signToken({ sub: rec.user_id, email: u[0].email });
  return { token: access, newRt, rtExpires } as const;
}

export async function logout(rt?: string) {
  if (rt) await query('DELETE FROM refresh_tokens WHERE token=$1', [rt]);
  return { ok: true } as const;
}

export async function createPasswordResetOtp(email: string) {
  const { rows: users } = await query<{ id: string }>('SELECT id FROM users WHERE email=$1', [email]);
  if (!users.length) return { ok: true } as const; // do not disclose existence
  const userId = users[0].id;
  const code = generateOtp();
  const expires = new Date(Date.now() + 60 * 60_000);
  await query('INSERT INTO otps(user_id, code, expires_at, purpose) VALUES($1,$2,$3,$4)', [userId, code, expires, 'password_reset']);
  await sendOtpEmail(email, code);
  logger.info({ email }, 'Password reset OTP generated');
  return { ok: true } as const;
}

export async function resetPasswordWithOtp(email: string, code: string, password: string) {
  const { rows: users } = await query<{ id: string }>('SELECT id FROM users WHERE email=$1', [email]);
  if (!users.length) return { invalid: true } as const;
  const userId = users[0].id;
  const { rows } = await query<{ id: string; expires_at: string; used: boolean }>(
    'SELECT id, expires_at, used FROM otps WHERE user_id=$1 AND code=$2 AND purpose=$3 ORDER BY created_at DESC LIMIT 1',
    [userId, code, 'password_reset']
  );
  if (!rows.length) return { invalid: true } as const;
  const rec = rows[0];
  if (rec.used) return { used: true } as const;
  if (new Date(rec.expires_at) < new Date()) return { expired: true } as const;
  const hash = await bcrypt.hash(password, 10);
  await query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, userId]);
  await query('UPDATE otps SET used=true WHERE id=$1', [rec.id]);
  logger.info({ email }, 'Password reset with OTP');
  return { ok: true } as const;
}
