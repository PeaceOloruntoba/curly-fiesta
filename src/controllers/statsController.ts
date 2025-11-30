import type { Response } from 'express';
import type { AuthedRequest } from '../middlewares/auth.js';
import * as svc from '../services/statsService.js';
import { AppError } from '../utils/appError.js';

export async function summary(req: AuthedRequest, res: Response) {
  const q = (req.query?.period as string | undefined)?.toLowerCase();
  const mapped = q === 'daily' ? 'today' : q;
  const period: svc.SummaryPeriod = (mapped as svc.SummaryPeriod) || 'today';
  if (!['today','week','month'].includes(period)) {
    throw AppError.badRequest('Invalid period', 'Choose daily, week or month');
  }
  const out = await svc.computeStatsSummary(req.user!.id, period);
  res.json(out);
}
