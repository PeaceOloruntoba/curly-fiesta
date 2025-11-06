import { Router, type Request, type Response } from 'express';
import { env } from '../../config/env.js';
import {
  registerUser,
  verifyEmailOtp,
  loginUser,
  refreshAccessToken,
  logout,
  createPasswordResetOtp,
  resetPasswordWithOtp,
} from '../../services/authService.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const out = await registerUser(email, password, name);
  if ('conflict' in out) return res.status(409).json({ error: 'Email already in use' });
  if (env.NODE_ENV !== 'production') {
    return res.status(201).json({ message: 'Registered. Verify OTP to activate account.', otp: out.code });
  }
  return res.status(201).json({ message: 'Registered. Verify OTP to activate account.' });
});

router.post('/verify-otp', async (req: Request, res: Response) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: 'Email and code required' });
  const out = await verifyEmailOtp(email, code);
  if ('notFound' in out) return res.status(404).json({ error: 'User not found' });
  if ('invalid' in out) return res.status(400).json({ error: 'Invalid code' });
  if ('used' in out) return res.status(400).json({ error: 'Code already used' });
  if ('expired' in out) return res.status(400).json({ error: 'Code expired' });
  return res.json({ message: 'Account verified' });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const out = await loginUser(email, password);
  if ('invalid' in out) return res.status(401).json({ error: 'Invalid credentials' });
  if ('unverified' in out) return res.status(403).json({ error: 'Account not verified' });
  res.cookie('rt', out.rt, { httpOnly: true, sameSite: 'lax', secure: env.NODE_ENV === 'production', maxAge: 30*24*60*60*1000 });
  return res.json({ token: out.token });
});

router.post('/refresh', async (req: Request, res: Response) => {
  const rt = req.cookies?.rt as string | undefined;
  if (!rt) return res.status(401).json({ error: 'Missing token' });
  const out = await refreshAccessToken(rt);
  if ('invalid' in out) return res.status(401).json({ error: 'Invalid token' });
  if ('expired' in out) return res.status(401).json({ error: 'Expired token' });
  res.cookie('rt', out.newRt, { httpOnly: true, sameSite: 'lax', secure: env.NODE_ENV === 'production', maxAge: 30*24*60*60*1000 });
  return res.json({ token: out.token });
});

router.post('/logout', async (req: Request, res: Response) => {
  const rt = req.cookies?.rt as string | undefined;
  await logout(rt);
  res.clearCookie('rt');
  return res.json({ message: 'Logged out' });
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });
  await createPasswordResetOtp(email);
  return res.json({ message: 'If the email exists, a reset code has been sent' });
});

router.post('/reset-password', async (req: Request, res: Response) => {
  const { email, code, password } = req.body || {};
  if (!email || !code || !password) return res.status(400).json({ error: 'Email, code and password required' });
  const out = await resetPasswordWithOtp(email, code, password);
  if ('invalid' in out) return res.status(400).json({ error: 'Invalid code' });
  if ('used' in out) return res.status(400).json({ error: 'Code already used' });
  if ('expired' in out) return res.status(400).json({ error: 'Code expired' });
  return res.json({ message: 'Password updated' });
});

export default router;
