import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import { enforceSubscription } from '../../middlewares/subscription.js';
import * as ctrl from '../../controllers/usersController.js';

const router = Router();

router.get('/me', requireAuth, enforceSubscription, ctrl.me);

export default router;
