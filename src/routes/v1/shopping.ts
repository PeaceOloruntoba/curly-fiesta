import { Router } from 'express';
import * as ctrl from '../../controllers/shoppingController.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';
import { requireAuth } from '../../middlewares/auth.js';
import { enforceSubscription } from '../../middlewares/subscription.js';

const router = Router();

router
  .route('/')
  .get(requireAuth, enforceSubscription, ctrl.index)
  .post(requireAuth, enforceSubscription, ctrl.create)
  .all(methodNotAllowed);

router
  .route('/:id')
  .get(requireAuth, enforceSubscription, ctrl.show)
  .put(requireAuth, enforceSubscription, ctrl.update)
  .delete(requireAuth, enforceSubscription, ctrl.destroy)
  .all(methodNotAllowed);

export default router;
