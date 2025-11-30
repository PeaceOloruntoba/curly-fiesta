import { Router } from 'express';
import * as ctrl from '../../controllers/statsController.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';
import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

// Stats are calculated from meals; expose summary endpoint only
router.get('/summary', requireAuth, ctrl.summary);

// Optional: remove detailed per-id endpoints since stats are derived
router.route('/').all(methodNotAllowed);

router.route('/:id').all(methodNotAllowed);

export default router;
