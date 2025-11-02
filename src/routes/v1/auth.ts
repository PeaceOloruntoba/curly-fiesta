import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../../db/pool.js';
import { signToken } from '../../utils/jwt.js';
import { generateOtp } from '../../utils/otp.js';
import { env } from '../../config/env.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const { rows: existing } = await query<{ id: string }>('SELECT id FROM users WHERE email=$1', [email]);
  if (existing.length) return res.status(409).json({ error: 'Email already in use' });

  const hash = await bcrypt.hash(password, 10);
  const { rows } = await query<{ id: string }>(
    'INSERT INTO users(email, password_hash, name) VALUES($1,$2,$3) RETURNING id',
    [email, hash, name || null]
  );
  const userId = rows[0].id;

  const code = generateOtp();
  const ttlMin = parseInt(env.OTP_TTL_MINUTES, 10) || 10;
  const expires = new Date(Date.now() + ttlMin * 60_000);
  await query(
    'INSERT INTO otps(user_id, code, expires_at) VALUES($1,$2,$3)',
    [userId, code, expires]
  );

  // TODO: send OTP via email/SMS. For now, return it in dev response
  return res.status(201).json({ message: 'Registered. Verify OTP to activate account.', otp: code });
});

router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' });
  const { rows: users } = await query<{ id: string; verified_at: string | null }>('SELECT id, verified_at FROM users WHERE email=$1', [email]);
  if (!users.length) return res.status(404).json({ error: 'User not found' });
  const userId = users[0].id;
  const { rows: otps } = await query<{ id: string; expires_at: string; used: boolean }>(
    'SELECT id, expires_at, used FROM otps WHERE user_id=$1 AND code=$2 ORDER BY created_at DESC LIMIT 1',
    [userId, code]
  );
  if (!otps.length) return res.status(400).json({ error: 'Invalid code' });
  const otp = otps[0];
  if (otp.used) return res.status(400).json({ error: 'Code already used' });
  if (new Date(otp.expires_at) < new Date()) return res.status(400).json({ error: 'Code expired' });

  await query('UPDATE users SET verified_at=NOW() WHERE id=$1', [userId]);
  await query('UPDATE otps SET used=true WHERE id=$1', [otp.id]);
  return res.json({ message: 'Account verified' });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const { rows } = await query<{ id: string; password_hash: string; verified_at: string | null }>(
    'SELECT id, password_hash, verified_at FROM users WHERE email=$1',
    [email]
  );
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  if (!user.verified_at) return res.status(403).json({ error: 'Account not verified' });

  const token = signToken({ sub: user.id, email });
  return res.json({ token });
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });
  const { rows: users } = await query<{ id: string }>('SELECT id FROM users WHERE email=$1', [email]);
  if (!users.length) return res.status(200).json({ message: 'If the email exists, a reset has been created' });
  const userId = users[0].id;
  const token = crypto.randomBytes(24).toString('hex');
  const expires = new Date(Date.now() + 60 * 60_000); // 1h
  await query('INSERT INTO password_resets(user_id, token, expires_at) VALUES($1,$2,$3)', [userId, token, expires]);
  // TODO: send token via email link
  return res.json({ message: 'Password reset created', token });
});

router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
  const { rows } = await query<{ id: string; user_id: string; expires_at: string; used: boolean }>(
    'SELECT id, user_id, expires_at, used FROM password_resets WHERE token=$1',
    [token]
  );
  if (!rows.length) return res.status(400).json({ error: 'Invalid token' });
  const pr = rows[0];
  if (pr.used) return res.status(400).json({ error: 'Token already used' });
  if (new Date(pr.expires_at) < new Date()) return res.status(400).json({ error: 'Token expired' });
  const hash = await bcrypt.hash(password, 10);
  await query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, pr.user_id]);
  await query('UPDATE password_resets SET used=true WHERE id=$1', [pr.id]);
  return res.json({ message: 'Password updated' });
});

export default router;
