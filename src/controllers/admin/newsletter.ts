import type { Request, Response } from 'express';
import * as newsletter from '../../services/newsletterService.js';
import { query } from '../../db/pool.js';

export async function create(req: Request, res: Response) {
  const { title, body_html, exclude_user_ids, is_admin_only, user_id } = req.body || {};
  if (!title || !body_html) return res.status(400).json({ error: 'Missing fields', errorMessage: 'Provide title and body_html' });
  const exclusions: string[] = Array.isArray(exclude_user_ids)
    ? exclude_user_ids
    : Array.isArray(user_id)
      ? user_id
      : user_id
        ? [user_id]
        : [];
  const result = await newsletter.createAndSend({
    title,
    body_html,
    is_admin_only: Boolean(is_admin_only),
    exclude_user_ids: exclusions,
  });
  return res.status(201).json(result);
}

export async function list(_req: Request, res: Response) {
  const rows = await newsletter.listNewsletters(50);
  return res.json(rows);
}

export async function get(req: Request, res: Response) {
  const id = req.params.id;
  const { rows } = await query('SELECT id, title, body_html, is_admin_only, created_at FROM newsletters WHERE id=$1', [id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  return res.json(rows[0]);
}
