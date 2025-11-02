import { Router } from 'express';
import auth from './v1/auth.js';
import users from './v1/users.js';
import recipes from './v1/recipes.js';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/recipes', recipes);

export default router;
