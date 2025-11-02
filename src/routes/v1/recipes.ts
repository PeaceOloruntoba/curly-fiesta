import { Router, type Request, type Response } from 'express';
import { query } from '../../db/pool.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const { rows } = await query<{ id: number; name: string; category: string }>(
    'SELECT id, name, category FROM recipes ORDER BY id ASC'
  );
  res.json(rows);
});

export default router;
