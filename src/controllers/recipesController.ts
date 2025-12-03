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
  const description: string | undefined = (req.body as any)?.description;
  const details: string | undefined = (req.body as any)?.details;
  // Nutrition fields, optional
  const calories = (req.body as any)?.calories;
  const protein_grams = (req.body as any)?.protein_grams;
  const carbs_grams = (req.body as any)?.carbs_grams;
  const fat_grams = (req.body as any)?.fat_grams;
  const hasNutrition = [calories, protein_grams, carbs_grams, fat_grams].some((v) => typeof v !== 'undefined');
  const nutrition = hasNutrition ? {
    calories: calories != null ? Number(calories) : undefined,
    protein_grams: protein_grams != null ? Number(protein_grams) : undefined,
    carbs_grams: carbs_grams != null ? Number(carbs_grams) : undefined,
    fat_grams: fat_grams != null ? Number(fat_grams) : undefined,
  } : undefined;
  const created = await svc.createRecipe({ name, category, image_url, description, details, nutrition });
  res.status(201).json(created);
}
export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  // Accept description and details JSON
  const patch: any = { ...req.body };
  const out = await svc.updateRecipe(id, patch || {});
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
