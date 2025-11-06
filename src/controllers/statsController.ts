import type { Response } from 'express';
import type { AuthedRequest } from '../middlewares/auth.js';
import * as svc from '../services/statsService.js';

export async function index(req: AuthedRequest, res: Response) {
  const { from, to } = req.query as { from?: string; to?: string };
  const items = await svc.listStats(req.user!.id, from, to);
  res.json(items);
}
export async function show(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const item = await svc.getStat(req.user!.id, id);
  if (!item) return res.status(404).json({ error: 'Not Found' });
  res.json(item);
}
export async function upsert(req: AuthedRequest, res: Response) {
  const { stat_date, calories, protein_grams, carbs_grams, fat_grams } = req.body || {};
  if (!stat_date) return res.status(400).json({ error: 'stat_date required (YYYY-MM-DD)' });
  const created = await svc.upsertStat(req.user!.id, { stat_date, calories: calories ?? 0, protein_grams: protein_grams ?? 0, carbs_grams: carbs_grams ?? 0, fat_grams: fat_grams ?? 0 });
  res.status(201).json(created);
}
export async function update(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const out = await svc.updateStat(req.user!.id, id, req.body || {});
  if (!out.updated) return res.status(400).json({ error: 'No updatable fields' });
  res.json({ ok: true });
}
export async function destroy(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  await svc.softDeleteStat(req.user!.id, id);
  res.status(204).end();
}

export async function summary(req: AuthedRequest, res: Response) {
  const period = (req.query.period as svc.SummaryPeriod | undefined) ?? 'today';
  if (!['today','week','month'].includes(period)) return res.status(400).json({ error: 'period must be today|week|month' });
  const out = await svc.computeStatsSummary(req.user!.id, period);
  res.json(out);
}
