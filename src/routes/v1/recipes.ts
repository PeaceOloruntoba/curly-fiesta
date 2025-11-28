import { Router } from 'express';
import * as ctrl from '../../controllers/recipesController.js';
import { methodNotAllowed } from '../../middlewares/methodNotAllowed.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router
  .route('/')
  .get(ctrl.index)
  .post(requireAuth, requireAdmin, upload.single('image'), ctrl.create)
  .all(methodNotAllowed);

router
  .route('/:id')
  .get(ctrl.show)
  .put(requireAuth, requireAdmin, ctrl.update)
  .delete(requireAuth, requireAdmin, ctrl.destroy)
  .all(methodNotAllowed);

// Upload/replace recipe image (admin only)
router.post('/:id/image', requireAuth, requireAdmin, upload.single('image'), ctrl.uploadImage);

export default router;
