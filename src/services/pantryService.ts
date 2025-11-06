import { query } from '../db/pool.js';

export type PantryItem = { id:number; user_id:string; name:string; quantity?:string|null; unit?:string|null; expires_at?:string|null };

export async function listPantry(userId: string) {
  const { rows } = await query<PantryItem>('SELECT id, user_id, name, quantity, unit, expires_at FROM pantry_items WHERE user_id=$1 AND deleted_at IS NULL ORDER BY id ASC',[userId]);
  return rows;
}
export async function getPantryItem(userId:string, id:number) {
  const { rows } = await query<PantryItem>('SELECT id, user_id, name, quantity, unit, expires_at FROM pantry_items WHERE id=$1 AND user_id=$2 AND deleted_at IS NULL',[id, userId]);
  return rows[0] || null;
}
export async function createPantryItem(userId:string, data: { name:string; quantity?:string; unit?:string; expires_at?:string }) {
  const { rows } = await query<{ id:number }>(
    'INSERT INTO pantry_items(user_id, name, quantity, unit, expires_at) VALUES($1,$2,$3,$4,$5) RETURNING id',
    [userId, data.name, data.quantity ?? null, data.unit ?? null, data.expires_at ?? null]
  );
  return rows[0];
}
export async function updatePantryItem(userId:string, id:number, data: Partial<Omit<PantryItem,'id'|'user_id'>>) {
  const fields:string[] = []; const params:any[] = []; let i=1;
  for (const [k,v] of Object.entries(data)) { fields.push(`${k}=$${i++}`); params.push(v); }
  if (!fields.length) return { updated:false } as const;
  params.push(id, userId);
  await query(`UPDATE pantry_items SET ${fields.join(', ')}, updated_at=NOW() WHERE id=$${i++} AND user_id=$${i}`,[...params]);
  return { updated:true } as const;
}
export async function softDeletePantryItem(userId:string, id:number) {
  await query('UPDATE pantry_items SET deleted_at=NOW() WHERE id=$1 AND user_id=$2 AND deleted_at IS NULL',[id,userId]);
  return { deleted:true } as const;
}
