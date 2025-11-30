import type { Response } from 'express';
import type { AuthedRequest } from '../middlewares/auth.js';
import * as svc from '../services/mealsService.js';
import { AppError } from '../utils/appError.js';

export async function getPlan(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) throw AppError.unauthorized('Unauthorized', 'Please sign in');
  const plan = await svc.getUserPlan(userId);
  return res.json(plan);
}

export async function putPlan(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) throw AppError.unauthorized('Unauthorized', 'Please sign in');
  const plan = req.body ?? {};
  await svc.replaceUserPlan(userId, plan);
  return res.json({ ok: true });
}

export async function clearPlan(req: AuthedRequest, res: Response) {
  const userId = req.user?.id;
  if (!userId) throw AppError.unauthorized('Unauthorized', 'Please sign in');
  await svc.clearUserPlan(userId);
  return res.json({ ok: true });
}
