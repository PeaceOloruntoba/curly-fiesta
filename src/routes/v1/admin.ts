import { Router, type Request, type Response } from 'express';
import { requireAuth, requireAdmin, type AuthedRequest } from '../../middlewares/auth.js';
import { query } from '../../db/pool.js';
import * as subs from '../../services/subscriptionService.js';
import * as newsletterCtrl from '../../controllers/admin/newsletter.js';

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

// Newsletters
router.post('/newsletters', newsletterCtrl.create);

router.get('/newsletters', newsletterCtrl.list);

router.get('/newsletters/:id', newsletterCtrl.get);

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

// Subscription settings
router.get('/subscriptions/settings', async (_req: Request, res: Response) => {
  const s = await subs.getSettings();
  return res.json(s);
});

router.put('/subscriptions/settings', async (req: Request, res: Response) => {
  const patch = req.body || {};
  const out = await subs.updateSettings(patch);
  if (!out.updated) return res.status(400).json({ error: 'No updatable fields', errorMessage: 'Nothing to update' });
  const s = await subs.getSettings();
  return res.json(s);
});

router.post('/subscriptions/founder-window/start', async (req: Request, res: Response) => {
  const starts = new Date();
  const ends = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
  await subs.updateSettings({ founder_discount_enabled: true, founder_window_starts_at: starts.toISOString(), founder_window_ends_at: ends.toISOString(), founder_awarded_count: 0 });
  return res.json({ ok: true, starts_at: starts.toISOString(), ends_at: ends.toISOString() });
});

router.post('/subscriptions/founder-window/stop', async (_req: Request, res: Response) => {
  await subs.updateSettings({ founder_discount_enabled: false, founder_window_starts_at: null as any, founder_window_ends_at: null as any });
  return res.json({ ok: true });
});

router.get('/subscriptions/overview', async (_req: Request, res: Response) => {
  const s = await subs.getSettings();
  const { rows } = await query<{ status: string; count: number }>('SELECT status, COUNT(*)::int as count FROM user_subscriptions GROUP BY status', []);
  return res.json({ settings: s, counts: rows });
});
