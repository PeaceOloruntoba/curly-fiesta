import type { Request, Response } from 'express';
import * as svc from '../services/nutritionService.js';
import { AppError } from '../utils/appError.js';

export async function index(req: Request, res: Response) {
  const recipeId = req.query.recipeId ? Number(req.query.recipeId) : undefined;
  const items = await svc.listNutrition(recipeId);
  res.json(items);
}
export async function show(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await svc.getNutrition(id);
  if (!item) throw AppError.notFound('Not Found', 'Nutrition not found');
  res.json(item);
}
export async function create(req: Request, res: Response) {
  const { recipe_id, calories, protein_grams, carbs_grams, fat_grams } = req.body || {};
  if (!recipe_id) throw AppError.badRequest('recipe_id required', 'Provide recipe_id');
  const created = await svc.createNutrition({ recipe_id, calories: calories ?? 0, protein_grams: protein_grams ?? 0, carbs_grams: carbs_grams ?? 0, fat_grams: fat_grams ?? 0 });
  res.status(201).json(created);
}
export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const out = await svc.updateNutrition(id, req.body || {});
  if (!out.updated) throw AppError.badRequest('No updatable fields', 'Nothing to update');
  res.json({ ok: true });
}
export async function destroy(req: Request, res: Response) {
  const id = Number(req.params.id);
  await svc.softDeleteNutrition(id);
  res.status(204).end();
}
