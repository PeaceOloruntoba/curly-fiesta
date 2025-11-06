import { query } from '../db/pool.js';

export type Nutrition = { id:number; recipe_id:number; calories:number; protein_grams:number; carbs_grams:number; fat_grams:number };

export async function listNutrition(recipeId?: number) {
  if (recipeId) {
    const { rows } = await query<Nutrition>('SELECT * FROM nutrition WHERE recipe_id=$1 AND deleted_at IS NULL ORDER BY id ASC',[recipeId]);
    return rows;
  }
  const { rows } = await query<Nutrition>('SELECT * FROM nutrition WHERE deleted_at IS NULL ORDER BY id ASC');
  return rows;
}
export async function getNutrition(id:number) {
  const { rows } = await query<Nutrition>('SELECT * FROM nutrition WHERE id=$1 AND deleted_at IS NULL',[id]);
  return rows[0] || null;
}
export async function createNutrition(data: Omit<Nutrition,'id'>) {
  const { rows } = await query<{ id:number }>(
    'INSERT INTO nutrition(recipe_id, calories, protein_grams, carbs_grams, fat_grams) VALUES($1,$2,$3,$4,$5) RETURNING id',
    [data.recipe_id, data.calories, data.protein_grams, data.carbs_grams, data.fat_grams]
  );
  return rows[0];
}
export async function updateNutrition(id:number, data: Partial<Omit<Nutrition,'id'>>) {
  const fields:string[] = []; const params:any[] = []; let i=1;
  for (const [k,v] of Object.entries(data)) { fields.push(`${k}=$${i++}`); params.push(v); }
  if (!fields.length) return { updated:false } as const;
  params.push(id);
  await query(`UPDATE nutrition SET ${fields.join(', ')}, updated_at=NOW() WHERE id=$${i}`,[...params]);
  return { updated:true } as const;
}
export async function softDeleteNutrition(id:number) {
  await query('UPDATE nutrition SET deleted_at=NOW() WHERE id=$1 AND deleted_at IS NULL',[id]);
  return { deleted:true } as const;
}
