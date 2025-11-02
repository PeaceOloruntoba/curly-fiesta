import { Router } from 'express';
import auth from './v1/auth.js';
import users from './v1/users.js';
import recipes from './v1/recipes.js';
import meals from './v1/meals.js';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/recipes', recipes);
router.use('/meals', meals);

export default router;
