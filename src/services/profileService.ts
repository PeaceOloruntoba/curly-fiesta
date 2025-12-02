import { query } from '../db/pool.js';

export type Profile = {
  id: string;
  user_id: string;
  avatar_url: string | null;
  bio: string | null;
  health: any | null;
  taste: any | null;
  preferences: any | null;
  created_at: string;
  updated_at: string;
};

export async function getUserBasic(userId: string) {
  const { rows } = await query<{ id: string; email: string; first_name: string | null; last_name: string | null; role: string }>(
    'SELECT id, email, first_name, last_name, role FROM users WHERE id=$1', [userId]
  );
  return rows[0] || null;
}

export async function updateUserBasic(userId: string, data: { first_name?: string | null; last_name?: string | null }) {
  const sets: string[] = []; const params: any[] = []; let i = 1;
  if (data.first_name !== undefined) { sets.push(`first_name=$${i++}`); params.push(data.first_name); }
  if (data.last_name !== undefined) { sets.push(`last_name=$${i++}`); params.push(data.last_name); }
  if (!sets.length) return getUserBasic(userId);
  params.push(userId);
  await query(`UPDATE users SET ${sets.join(', ')} WHERE id=$${i}`,[...params]);
  return getUserBasic(userId);
}

export async function getProfile(userId: string) {
  const { rows } = await query<Profile>('SELECT * FROM profiles WHERE user_id=$1', [userId]);
  return rows[0] || null;
}

export async function upsertProfile(userId: string, patch: Record<string, any>) {
  // Ensure row exists
  await query('INSERT INTO profiles(user_id) VALUES($1) ON CONFLICT (user_id) DO NOTHING', [userId]);
  const keys = Object.keys(patch) as (keyof typeof patch)[];
  if (!keys.length) return getProfile(userId);
  const sets: string[] = []; const params: any[] = []; let i = 1;
  for (const k of keys) { sets.push(`${k} = $${i++}`); params.push((patch as any)[k]); }
  params.push(userId);
  await query(`UPDATE profiles SET ${sets.join(', ')}, updated_at=NOW() WHERE user_id=$${i}`, params);
  return getProfile(userId);
}
