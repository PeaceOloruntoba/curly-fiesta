import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import * as billing from '../services/billingService.js';
import type { AuthedRequest } from '../middlewares/auth.js';

export async function listPublicPlans(_req: Request, res: Response, next: NextFunction) {
  try {
    const out = await billing.listPublicPlans();
    res.json(out);
  } catch (e) { next(e); }
}

export async function listPlans(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const out = await billing.listPlans(req.user!.id);
    res.json(out);
  } catch (e) { next(e); }
}

export async function status(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const out = await billing.getStatus(req.user!.id);
    res.json(out);
  } catch (e) { next(e); }
}

export async function checkout(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const { plan } = req.body || {};
    if (!plan || !['monthly','quarterly','biannual','annual'].includes(plan)) {
      throw AppError.badRequest('Invalid plan', 'Choose a valid plan');
    }
    const out = await billing.initCheckout(req.user!.id, plan);
    res.json(out);
  } catch (e) { next(e); }
}

export async function cancel(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const out = await billing.cancel(req.user!.id);
    res.json(out);
  } catch (e) { next(e); }
}

// Paystack webhook (unauthenticated). Ensure raw body is available in middleware if possible.
export async function webhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['x-paystack-signature'] as string | undefined;
    // Prefer raw body if available (e.g., from a raw body parser); fallback to JSON string
    const raw = (req as any).rawBody ? String((req as any).rawBody) : JSON.stringify(req.body ?? {});
    const out = await billing.handleWebhook(raw, signature);
    res.json(out);
  } catch (e) { next(e); }
}
