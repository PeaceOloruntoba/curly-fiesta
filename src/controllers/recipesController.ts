import type { Request, Response } from 'express';
import * as svc from '../services/recipesService.js';

export async function index(_req: Request, res: Response) {
  const items = await svc.listRecipes();
  res.json(items);
}
export async function show(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await svc.getRecipe(id);
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
}
export async function create(req: Request, res: Response) {
  const { name, category } = req.body || {};
  if (!name || !category) return res.status(400).json({ error: 'name and category required' });
  const created = await svc.createRecipe({ name, category });
  res.status(201).json(created);
}
export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const out = await svc.updateRecipe(id, req.body || {});
  if (!out.updated) return res.status(400).json({ error: 'No updatable fields' });
  res.json({ ok: true });
}
export async function destroy(req: Request, res: Response) {
  const id = Number(req.params.id);
  await svc.softDeleteRecipe(id);
  res.status(204).end();
}
