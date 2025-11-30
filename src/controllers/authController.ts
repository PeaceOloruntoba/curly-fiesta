import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';
import {
  registerUser,
  verifyEmailOtp,
  loginUser,
  refreshAccessToken,
  logout as svcLogout,
  logoutAll as svcLogoutAll,
  createPasswordResetOtp,
  resetPasswordWithOtp,
} from '../services/authService.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) throw AppError.badRequest('Email and password required', 'Enter your email and password');
    const out = await registerUser(email, password, name);
    if ('conflict' in out) throw AppError.conflict('Email already in use', 'Email already in use');
    if (env.NODE_ENV !== 'production') {
      return res.status(201).json({ message: 'Registered. Verify OTP to activate account.', otp: out.code });
    }
    return res.status(201).json({ message: 'Registered. Verify OTP to activate account.' });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, code } = req.body || {};
    if (!email || !code) throw AppError.badRequest('Email and code required', 'Provide email and code');
    const out = await verifyEmailOtp(email, code);
    if ('notFound' in out) throw AppError.notFound('User not found', 'Account not found');
    if ('invalid' in out) throw AppError.badRequest('Invalid code', 'Invalid verification code');
    if ('used' in out) throw AppError.badRequest('Code already used', 'Code already used');
    if ('expired' in out) throw AppError.badRequest('Code expired', 'Verification code expired');
    return res.json({ message: 'Account verified' });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) throw AppError.badRequest('Email and password required', 'Enter your email and password');
    const ua = req.headers['user-agent'];
    const ip = req.ip;
    const out = await loginUser(email, password, { ua, ip });
    if ('invalid' in out) throw AppError.unauthorized('Invalid credentials', 'Invalid email or password');
    if ('unverified' in out) throw AppError.forbidden('Account not verified', 'Verify your email to continue');
    res.cookie('rt', out.rt, { httpOnly: true, sameSite: 'lax', secure: env.NODE_ENV === 'production', maxAge: 30*24*60*60*1000 });
    return res.json({ token: out.token, user: out.user });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization || '';
    const rtHeader = header.startsWith('Refresh ') ? header.slice(8) : undefined;
    const rt = (req.cookies?.rt as string | undefined) || rtHeader;
    if (!rt) throw AppError.unauthorized('Missing token', 'Please sign in');
    const ua = req.headers['user-agent'];
    const ip = req.ip;
    const out = await refreshAccessToken(rt, { ua, ip });
    if ('invalid' in out) throw AppError.unauthorized('Invalid token', 'Please sign in');
    if ('expired' in out) throw AppError.unauthorized('Expired token', 'Please sign in');
    res.cookie('rt', out.newRt, { httpOnly: true, sameSite: 'lax', secure: env.NODE_ENV === 'production', maxAge: 30*24*60*60*1000 });
    return res.json({ token: out.token, user: out.user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const rt = req.cookies?.rt as string | undefined;
    await svcLogout(rt);
    res.clearCookie('rt');
    return res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

export async function logoutAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id as string | undefined;
    if (!userId) throw AppError.unauthorized('Unauthorized', 'Please sign in');
    await svcLogoutAll(userId);
    res.clearCookie('rt');
    return res.json({ message: 'Logged out from all devices' });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body || {};
    if (!email) throw AppError.badRequest('Email required', 'Enter your email');
    await createPasswordResetOtp(email);
    return res.json({ message: 'If the email exists, a reset code has been sent' });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, code, password } = req.body || {};
    if (!email || !code || !password) throw AppError.badRequest('Email, code and password required', 'Provide email, code and new password');
    const out = await resetPasswordWithOtp(email, code, password);
    if ('invalid' in out) throw AppError.badRequest('Invalid code', 'Invalid reset code');
    if ('expired' in out) throw AppError.badRequest('Expired code', 'Reset code expired');
    return res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}
