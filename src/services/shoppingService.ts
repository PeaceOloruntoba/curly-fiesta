import { query } from '../db/pool.js';

export type ShoppingItem = { id:number; user_id:string; name:string; quantity?:string|null; checked:boolean };

export async function listShopping(userId: string) {
  const { rows } = await query<ShoppingItem>('SELECT id, user_id, name, quantity, checked FROM shopping_items WHERE user_id=$1 AND deleted_at IS NULL ORDER BY id ASC',[userId]);
  return rows;
}
export async function getShoppingItem(userId:string, id:number) {
  const { rows } = await query<ShoppingItem>('SELECT id, user_id, name, quantity, checked FROM shopping_items WHERE id=$1 AND user_id=$2 AND deleted_at IS NULL',[id, userId]);
  return rows[0] || null;
}
export async function createShoppingItem(userId:string, data: { name:string; quantity?:string }) {
  const { rows } = await query<{ id:number }>(
    'INSERT INTO shopping_items(user_id, name, quantity) VALUES($1,$2,$3) RETURNING id',
    [userId, data.name, data.quantity ?? null]
  );
  return rows[0];
}
export async function updateShoppingItem(userId:string, id:number, data: Partial<Omit<ShoppingItem,'id'|'user_id'>>) {
  const fields:string[] = []; const params:any[] = []; let i=1;
  for (const [k,v] of Object.entries(data)) { fields.push(`${k}=$${i++}`); params.push(v); }
  if (!fields.length) return { updated:false } as const;
  params.push(id, userId);
  await query(`UPDATE shopping_items SET ${fields.join(', ')}, updated_at=NOW() WHERE id=$${i++} AND user_id=$${i}`,[...params]);
  return { updated:true } as const;
}
export async function softDeleteShoppingItem(userId:string, id:number) {
  await query('UPDATE shopping_items SET deleted_at=NOW() WHERE id=$1 AND user_id=$2 AND deleted_at IS NULL',[id,userId]);
  return { deleted:true } as const;
}
