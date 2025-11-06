import type { Request, Response } from 'express';
import * as svc from '../services/pantryService.js';
import type { AuthedRequest } from '../middlewares/auth.js';

export async function index(req: AuthedRequest, res: Response) {
  const items = await svc.listPantry(req.user!.id);
  res.json(items);
}
export async function show(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const item = await svc.getPantryItem(req.user!.id, id);
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
}
export async function create(req: AuthedRequest, res: Response) {
  const { name, quantity, unit, expires_at } = req.body || {};
  if (!name) return res.status(400).json({ error: 'name required' });
  const created = await svc.createPantryItem(req.user!.id, { name, quantity, unit, expires_at });
  res.status(201).json(created);
}
export async function update(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const out = await svc.updatePantryItem(req.user!.id, id, req.body || {});
  if (!out.updated) return res.status(400).json({ error: 'No updatable fields' });
  res.json({ ok: true });
}
export async function destroy(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  await svc.softDeletePantryItem(req.user!.id, id);
  res.status(204).end();
}
