import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { query } from '../db/pool.js';

export type AuthedRequest = Request & { user?: { id: string; email: string; role: 'user' | 'admin' } };

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = verifyToken<{ sub: string; email: string; tv?: number }>(token);
    // Enforce token_version by checking current DB value
    const { rows } = await query<{ token_version: number; role: 'user' | 'admin'; deleted_at: string | null }>('SELECT token_version, role, deleted_at FROM users WHERE id=$1', [payload.sub]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid token' });
    const { token_version, role, deleted_at } = rows[0];
    if (deleted_at) return res.status(403).json({ error: 'Account disabled' });
    if ((payload.tv ?? 0) !== token_version) return res.status(401).json({ error: 'Token revoked' });
    req.user = { id: payload.sub, email: payload.email, role };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
}
