import { query } from '../db/pool.js';
import { getNutritionByRecipeIds, type MacroTotals } from './nutritionService.js';

export type UserStat = { id:number; user_id:string; stat_date:string; calories:number; protein_grams:number; carbs_grams:number; fat_grams:number };

export async function listStats(userId: string, from?: string, to?: string) {
  if (from && to) {
    const { rows } = await query<UserStat>('SELECT * FROM user_stats WHERE user_id=$1 AND deleted_at IS NULL AND stat_date BETWEEN $2 AND $3 ORDER BY stat_date ASC',[userId, from, to]);
    return rows;
  }
  const { rows } = await query<UserStat>('SELECT * FROM user_stats WHERE user_id=$1 AND deleted_at IS NULL ORDER BY stat_date DESC',[userId]);
  return rows;
}
export async function getStat(userId:string, id:number) {
  const { rows } = await query<UserStat>('SELECT * FROM user_stats WHERE id=$1 AND user_id=$2 AND deleted_at IS NULL',[id, userId]);
  return rows[0] || null;
}
export async function upsertStat(userId:string, data: Omit<UserStat,'id'|'user_id'>) {
  const { rows } = await query<{ id:number }>(
    `INSERT INTO user_stats(user_id, stat_date, calories, protein_grams, carbs_grams, fat_grams)
     VALUES($1,$2,$3,$4,$5,$6)
     ON CONFLICT (user_id, stat_date)
     DO UPDATE SET calories=EXCLUDED.calories, protein_grams=EXCLUDED.protein_grams, carbs_grams=EXCLUDED.carbs_grams, fat_grams=EXCLUDED.fat_grams, updated_at=NOW()
     RETURNING id`,
    [userId, data.stat_date, data.calories, data.protein_grams, data.carbs_grams, data.fat_grams]
  );
  return rows[0];
}
export async function updateStat(userId:string, id:number, data: Partial<Omit<UserStat,'id'|'user_id'>>) {
  const fields:string[] = []; const params:any[] = []; let i=1;
  for (const [k,v] of Object.entries(data)) { fields.push(`${k}=$${i++}`); params.push(v); }
  if (!fields.length) return { updated:false } as const;
  params.push(id, userId);
  await query(`UPDATE user_stats SET ${fields.join(', ')}, updated_at=NOW() WHERE id=$${i++} AND user_id=$${i}`,[...params]);
  return { updated:true } as const;
}
export async function softDeleteStat(userId:string, id:number) {
  await query('UPDATE user_stats SET deleted_at=NOW() WHERE id=$1 AND user_id=$2 AND deleted_at IS NULL',[id,userId]);
  return { deleted:true } as const;
}

type MealEntry = { id:number; name?:string } | null | undefined;
type DayPlan = { breakfast?: MealEntry; lunch?: MealEntry; dinner?: MealEntry };
type MealPlan = Record<string, DayPlan>;

export type SummaryPeriod = 'today' | 'week' | 'month';
export type DayBreakdown = { date: string; weekday: string; totals: MacroTotals };
export type SummaryResult = { period: SummaryPeriod; range: { from: string; to: string }; totals: MacroTotals; days?: DayBreakdown[] };

export async function getUserMealPlan(userId: string): Promise<MealPlan> {
  const { rows } = await query<{ plan: any }>('SELECT plan FROM user_meal_plans WHERE user_id=$1', [userId]);
  return (rows[0]?.plan ?? {}) as MealPlan;
}

function weekdayName(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function add(a: MacroTotals, b: MacroTotals): MacroTotals {
  return {
    calories: (a.calories || 0) + (b.calories || 0),
    protein_grams: (a.protein_grams || 0) + (b.protein_grams || 0),
    carbs_grams: (a.carbs_grams || 0) + (b.carbs_grams || 0),
    fat_grams: (a.fat_grams || 0) + (b.fat_grams || 0),
  };
}

function zeroTotals(): MacroTotals { return { calories:0, protein_grams:0, carbs_grams:0, fat_grams:0 }; }

function recipeIdsFromDay(day: DayPlan): number[] {
  const ids: number[] = [];
  for (const k of ['breakfast','lunch','dinner'] as const) {
    const entry = day?.[k];
    if (entry && typeof entry.id === 'number') ids.push(entry.id);
  }
  return ids;
}

export async function computeStatsSummary(userId: string, period: SummaryPeriod, now = new Date()): Promise<SummaryResult> {
  const plan = await getUserMealPlan(userId);

  // Helper to total a single day by weekday label
  async function totalForWeekday(name: string): Promise<MacroTotals> {
    const day = plan[name as keyof MealPlan] as DayPlan | undefined;
    if (!day) return zeroTotals();
    const ids = recipeIdsFromDay(day);
    const map = await getNutritionByRecipeIds(ids);
    let total = zeroTotals();
    for (const id of ids) total = add(total, map[id] ?? zeroTotals());
    return total;
  }

  const currentDate = new Date(now);
  const fromTo = { from: '', to: '' };
  if (period === 'today') {
    const weekday = weekdayName(currentDate);
    const totals = await totalForWeekday(weekday);
    const dateStr = currentDate.toISOString().slice(0,10);
    fromTo.from = dateStr; fromTo.to = dateStr;
    return { period, range: fromTo, totals };
  }

  if (period === 'week') {
    // Build 7-day sequence starting Monday..Sunday using fixed labels
    const labels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const days: DayBreakdown[] = [];
    let totals = zeroTotals();
    for (const label of labels) {
      const t = await totalForWeekday(label);
      totals = add(totals, t);
      days.push({ date: label, weekday: label, totals: t });
    }
    // use current week monday..sunday for range
    const dayIdx = (currentDate.getDay() + 6) % 7; // 0..6, Monday=0
    const monday = new Date(currentDate); monday.setDate(currentDate.getDate() - dayIdx);
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
    fromTo.from = monday.toISOString().slice(0,10);
    fromTo.to = sunday.toISOString().slice(0,10);
    return { period, range: fromTo, totals, days };
  }

  // month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: DayBreakdown[] = [];
  let totals = zeroTotals();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const label = weekdayName(date);
    const t = await totalForWeekday(label);
    totals = add(totals, t);
    days.push({ date: date.toISOString().slice(0,10), weekday: label, totals: t });
  }
  const first = new Date(year, month, 1).toISOString().slice(0,10);
  const last = new Date(year, month, daysInMonth).toISOString().slice(0,10);
  fromTo.from = first; fromTo.to = last;
  return { period, range: fromTo, totals, days };
}
