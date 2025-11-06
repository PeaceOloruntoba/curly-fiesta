import { Router } from 'express';
import * as ctrl from '../../controllers/statsController.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';
import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router
  .route('/')
  .get(requireAuth, ctrl.index)
  .post(requireAuth, ctrl.upsert)
  .all(methodNotAllowed);

router.get('/summary', requireAuth, ctrl.summary);

router
  .route('/:id')
  .get(requireAuth, ctrl.show)
  .put(requireAuth, ctrl.update)
  .delete(requireAuth, ctrl.destroy)
  .all(methodNotAllowed);

export default router;
