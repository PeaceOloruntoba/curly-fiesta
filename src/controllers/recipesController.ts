import type { Request, Response } from 'express';
import * as svc from '../services/recipesService.js';
import { AppError } from '../utils/appError.js';
import { uploadRecipeImage } from '../utils/cloudinary.js';

export async function index(_req: Request, res: Response) {
  const items = await svc.listRecipes();
  res.json(items);
}
export async function show(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await svc.getRecipe(id);
  if (!item) throw AppError.notFound('Not Found', 'Recipe not found');
  res.json(item);
}
export async function create(req: Request, res: Response) {
  const { name, category } = req.body || {};
  if (!name || !category) throw AppError.badRequest('name and category required', 'Provide name and category');
  let image_url: string | undefined = (req.body as any)?.image_url || undefined;
  const file = (req as any).file as Express.Multer.File | undefined;
  if (file) {
    const up = await uploadRecipeImage(file.buffer, file.originalname);
    image_url = up.url;
  }
  const created = await svc.createRecipe({ name, category, image_url });
  res.status(201).json(created);
}
export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const out = await svc.updateRecipe(id, req.body || {});
  if (!out.updated) throw AppError.badRequest('No updatable fields', 'Nothing to update');
  res.json({ ok: true });
}
export async function destroy(req: Request, res: Response) {
  const id = Number(req.params.id);
  await svc.softDeleteRecipe(id);
  res.status(204).end();
}

export async function uploadImage(req: Request, res: Response) {
  const id = Number(req.params.id);
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: 'Image file is required' });
  const { url } = await uploadRecipeImage(file.buffer, file.originalname);
  await svc.updateRecipe(id, { image_url: url });
  return res.json({ id, image_url: url });
}
