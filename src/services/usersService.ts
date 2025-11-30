import { query } from '../db/pool.js';

export type UserBasic = { id: string; email: string; name: string | null; role: 'user' | 'admin' };

export async function getUserBasic(id: string): Promise<UserBasic | null> {
  const { rows } = await query<UserBasic>('SELECT id, email, name, role FROM users WHERE id=$1', [id]);
  return rows[0] || null;
}
