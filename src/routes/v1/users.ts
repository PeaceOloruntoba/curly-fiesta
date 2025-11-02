import { Router, type Request, type Response } from 'express';
import { requireAuth, type AuthedRequest } from '../../middlewares/auth.js';
import { query } from '../../db/pool.js';

const router = Router();

router.get('/me', requireAuth, async (req: AuthedRequest, res: Response) => {
  const userId = req.user!.id;
  const { rows } = await query<{ id: string; email: string; name: string | null }>(
    'SELECT id, email, name FROM users WHERE id=$1',
    [userId]
  );
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

export default router;
