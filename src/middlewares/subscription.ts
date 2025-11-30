import type { NextFunction, Response } from 'express';
import type { AuthedRequest } from './auth.js';
import { requireActiveOrTrial, startTrialIfNeeded } from '../services/subscriptionService.js';

export async function enforceSubscription(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized', errorMessage: 'Please sign in' });
    // Ensure trial exists when applicable
    await startTrialIfNeeded(userId);
    const check = await requireActiveOrTrial(userId);
    if (!check.ok) return res.status(402).json({ error: 'Subscription required', errorMessage: 'Subscription required' });
    next();
  } catch (e) {
    next(e);
  }
}
