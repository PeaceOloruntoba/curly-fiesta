import type { Response } from 'express';
import type { AuthedRequest } from '../middlewares/auth.js';
import { query } from '../db/pool.js';
import { AppError } from '../utils/appError.js';

export async function me(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) throw AppError.unauthorized('Unauthorized', 'Please sign in');
  const { rows } = await query<{ id: string; email: string; name: string | null }>(
    'SELECT id, email, name FROM users WHERE id=$1',
    [userId]
  );
  if (!rows.length) throw AppError.notFound('User not found', 'Account not found');
  res.json(rows[0]);
}
