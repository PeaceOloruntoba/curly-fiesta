import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import * as ctrl from '../../controllers/usersController.js';

const router = Router();

router.get('/me', requireAuth, ctrl.me);

export default router;
