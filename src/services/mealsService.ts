import { query } from '../db/pool.js';

export async function getUserPlan(userId: string) {
  const { rows } = await query<{ plan: any }>('SELECT plan FROM user_meal_plans WHERE user_id=$1', [userId]);
  return rows[0]?.plan ?? {};
}

export async function replaceUserPlan(userId: string, plan: any) {
  await query(
    `INSERT INTO user_meal_plans(user_id, plan, updated_at)
     VALUES($1,$2,NOW())
     ON CONFLICT (user_id) DO UPDATE SET plan=EXCLUDED.plan, updated_at=EXCLUDED.updated_at`,
    [userId, plan]
  );
  return { ok: true } as const;
}

export async function clearUserPlan(userId: string) {
  await query('DELETE FROM user_meal_plans WHERE user_id=$1', [userId]);
  return { ok: true } as const;
}
