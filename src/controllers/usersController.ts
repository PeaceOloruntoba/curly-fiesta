import type { Response } from 'express';
import type { AuthedRequest } from '../middlewares/auth.js';
import { AppError } from '../utils/appError.js';
import * as users from '../services/usersService.js';

export async function me(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) throw AppError.unauthorized('Unauthorized', 'Please sign in');
  const u = await users.getUserBasic(userId);
  if (!u) throw AppError.notFound('User not found', 'Account not found');
  res.json(u);
}
