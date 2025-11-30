import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import * as ctrl from '../../controllers/mealsController.js';

const router = Router();

// Get current user's meal plan JSON
router.get('/plan', requireAuth, ctrl.getPlan);

// Replace current user's meal plan JSON
router.put('/plan', requireAuth, ctrl.putPlan);

// Clear plan
router.post('/plan/clear', requireAuth, ctrl.clearPlan);

export default router;
