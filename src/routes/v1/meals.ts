import { Router, type Request, type Response } from 'express';
import { requireAuth, type AuthedRequest } from '../../middlewares/auth.js';
import { query } from '../../db/pool.js';

const router = Router();

// Get current user's meal plan JSON
router.get('/plan', requireAuth, async (req: AuthedRequest, res: Response) => {
  const userId = req.user!.id;
  const { rows } = await query<{ plan: any }>('SELECT plan FROM user_meal_plans WHERE user_id=$1', [userId]);
  return res.json(rows[0]?.plan ?? {});
});

// Replace current user's meal plan JSON
router.put('/plan', requireAuth, async (req: AuthedRequest, res: Response) => {
  const userId = req.user!.id;
  const plan = req.body ?? {};
  await query(
    `INSERT INTO user_meal_plans(user_id, plan, updated_at)
     VALUES($1,$2,NOW())
     ON CONFLICT (user_id) DO UPDATE SET plan=EXCLUDED.plan, updated_at=EXCLUDED.updated_at`,
    [userId, plan]
  );
  return res.json({ ok: true });
});

// Clear plan
router.post('/plan/clear', requireAuth, async (req: AuthedRequest, res: Response) => {
  const userId = req.user!.id;
  await query('DELETE FROM user_meal_plans WHERE user_id=$1', [userId]);
  return res.json({ ok: true });
});

export default router;
