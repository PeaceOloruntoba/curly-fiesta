import { Router } from 'express';
import * as ctrl from '../../controllers/nutritionController.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';

const router = Router();

router
  .route('/')
  .get(ctrl.index)
  .post(ctrl.create)
  .all(methodNotAllowed);

router
  .route('/:id')
  .get(ctrl.show)
  .put(ctrl.update)
  .delete(ctrl.destroy)
  .all(methodNotAllowed);

export default router;
