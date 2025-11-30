import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import { enforceSubscription } from '../../middlewares/subscription.js';
import * as ctrl from '../../controllers/mealsController.js';

const router = Router();

// Get current user's meal plan JSON
router.get('/plan', requireAuth, enforceSubscription, ctrl.getPlan);

// Replace current user's meal plan JSON
router.put('/plan', requireAuth, enforceSubscription, ctrl.putPlan);

// Clear plan
router.post('/plan/clear', requireAuth, enforceSubscription, ctrl.clearPlan);

export default router;
