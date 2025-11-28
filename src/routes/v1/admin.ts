import { Router, type Request, type Response } from 'express';
import { requireAuth, requireAdmin, type AuthedRequest } from '../../middlewares/auth.js';
import { query } from '../../db/pool.js';

const router = Router();
router.use(requireAuth, requireAdmin);

// List users (optional q by email)
router.get('/users', async (req: Request, res: Response) => {
  const q = (req.query.q as string | undefined)?.toLowerCase();
  if (q) {
    const { rows } = await query('SELECT id, email, name, role, deleted_at FROM users WHERE LOWER(email) LIKE $1 ORDER BY created_at DESC LIMIT 100', [`%${q}%`]);
    return res.json(rows);
  }
  const { rows } = await query('SELECT id, email, name, role, deleted_at FROM users ORDER BY created_at DESC LIMIT 100');
  return res.json(rows);
});

// Set role
router.post('/users/:id/role', async (req: Request, res: Response) => {
  const id = req.params.id;
  const { role } = req.body || {};
  if (role !== 'user' && role !== 'admin') return res.status(400).json({ error: 'Invalid role' });
  await query('UPDATE users SET role=$1 WHERE id=$2', [role, id]);
  return res.json({ ok: true });
});

// Block user (soft delete)
router.post('/users/:id/block', async (req: Request, res: Response) => {
  const id = req.params.id;
  await query('UPDATE users SET deleted_at=NOW() WHERE id=$1 AND deleted_at IS NULL', [id]);
  return res.json({ ok: true });
});

// Unblock user
router.post('/users/:id/unblock', async (req: Request, res: Response) => {
  const id = req.params.id;
  await query('UPDATE users SET deleted_at=NULL WHERE id=$1', [id]);
  return res.json({ ok: true });
});

// Force logout all sessions (bump token_version)
router.post('/users/:id/logout-all', async (req: Request, res: Response) => {
  const id = req.params.id;
  await query('DELETE FROM refresh_tokens WHERE user_id=$1', [id]);
  await query('UPDATE users SET token_version = token_version + 1 WHERE id=$1', [id]);
  return res.json({ ok: true });
});

export default router;
