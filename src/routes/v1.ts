import { Router } from 'express';
import auth from './v1/auth.js';
import users from './v1/users.js';
import recipes from './v1/recipes.js';
import meals from './v1/meals.js';
import nutrition from './v1/nutrition.js';
import pantry from './v1/pantry.js';
import shopping from './v1/shopping.js';
import stats from './v1/stats.js';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/recipes', recipes);
router.use('/meals', meals);
router.use('/nutrition', nutrition);
router.use('/pantry', pantry);
router.use('/shopping', shopping);
router.use('/stats', stats);

export default router;
