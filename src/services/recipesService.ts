import { query } from '../db/pool.js';

export async function listRecipes() {
  const { rows } = await query<{ id:number; name:string; category:string; image_url: string | null }>('SELECT id, name, category, image_url FROM recipes WHERE deleted_at IS NULL ORDER BY id ASC');
  return rows;
}
export async function getRecipe(id: number) {
  const { rows } = await query<{ id:number; name:string; category:string; image_url: string | null; description: string | null; details: string | null }>(
    'SELECT id, name, category, image_url, description, details FROM recipes WHERE id=$1 AND deleted_at IS NULL',
    [id]
  );
  return rows[0] || null;
}
export async function createRecipe(data: {
  name: string;
  category: string;
  image_url?: string | null;
  description?: string | null;
  details?: string | null;
  nutrition?: { calories?: number; protein_grams?: number; carbs_grams?: number; fat_grams?: number } | null;
}) {
  // Begin transaction
  await query('BEGIN');
  try {
    const { rows } = await query<{ id:number }>(
      'INSERT INTO recipes(name, category, image_url, description, details) VALUES($1,$2,$3,$4,$5) RETURNING id',
      [data.name, data.category, data.image_url ?? null, data.description ?? null, data.details ?? null]
    );
    const rec = rows[0];
    const n = data.nutrition || null;
    if (n && (n.calories !== undefined || n.protein_grams !== undefined || n.carbs_grams !== undefined || n.fat_grams !== undefined)) {
      await query(
        `INSERT INTO nutrition(recipe_id, calories, protein_grams, carbs_grams, fat_grams)
         VALUES($1,$2,$3,$4,$5)`,
        [rec.id, n.calories ?? 0, n.protein_grams ?? 0, n.carbs_grams ?? 0, n.fat_grams ?? 0]
      );
    }
    await query('COMMIT');
    return rec;
  } catch (e) {
    await query('ROLLBACK');
    throw e;
  }
}
export async function updateRecipe(id:number, data: { name?:string; category?:string; image_url?: string | null; description?: string | null; details?: string | null }) {
  const fields = [] as string[]; const params = [] as any[]; let i = 1;
  if (data.name !== undefined) { fields.push(`name=$${i++}`); params.push(data.name); }
  if (data.category !== undefined) { fields.push(`category=$${i++}`); params.push(data.category); }
  if (data.image_url !== undefined) { fields.push(`image_url=$${i++}`); params.push(data.image_url); }
  if (data.description !== undefined) { fields.push(`description=$${i++}`); params.push(data.description); }
  if (data.details !== undefined) { fields.push(`details=$${i++}`); params.push(data.details); }
  if (!fields.length) return { updated:false } as const;
  params.push(id);
  await query(`UPDATE recipes SET ${fields.join(', ')}, created_at=created_at, deleted_at=NULL WHERE id=$${i}`,[...params]);
  return { updated:true } as const;
}
export async function softDeleteRecipe(id:number) {
  await query('UPDATE recipes SET deleted_at=NOW() WHERE id=$1 AND deleted_at IS NULL',[id]);
  return { deleted:true } as const;
}
