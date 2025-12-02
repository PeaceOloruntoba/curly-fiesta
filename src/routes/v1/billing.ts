import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import { enforceSubscription } from '../../middlewares/subscription.js';
import * as ctrl from '../../controllers/billingController.js';

const router = Router();

// Public plans for landing page
router.get('/public/plans', ctrl.listPublicPlans);

// Plans available for the user (with founder discount applied if eligible)
router.get('/plans', requireAuth, ctrl.listPlans);

// Current subscription/trial status for the user
router.get('/status', requireAuth, ctrl.status);

// Initialize checkout for a plan (returns reference; frontend can open Paystack checkout)
router.post('/checkout', requireAuth, ctrl.checkout);

// Cancel auto-renew for the current subscription
router.post('/cancel', requireAuth, ctrl.cancel);

// Paystack webhook (no auth). Ensure raw body is accessible upstream if needed.
router.post('/webhook/paystack', ctrl.webhook);

export default router;
