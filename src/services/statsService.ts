import { query } from '../db/pool.js';

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
