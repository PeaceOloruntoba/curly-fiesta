import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middlewares/auth.js';
import * as ctrl from '../../controllers/profileController.js';

const upload = multer();
const router = Router();

router.get('/', requireAuth, ctrl.getProfile);
router.put('/', requireAuth, upload.single('avatar'), ctrl.updateProfile);

export default router;
