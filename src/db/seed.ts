import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { query } from './pool.js';
import { logger } from '../config/logger.js';
import { RECIPES } from '../data/recipes.js';
import { RECIPES as IMAGE_RECIPES } from '../data/recipe_images.js';

async function main() {
  logger.info('Starting seed...');
  // Recipes + nutrition
  for (const r of RECIPES) {
    const img = IMAGE_RECIPES.find((x) => x.id === r.id && x.name === r.name);
    const image_url = img?.image_url ?? null;
    const description = (img as any)?.description ?? null;
    const details = (img as any)?.details ?? null;
    // Insert with fixed ID for stable references
    await query(
      `INSERT INTO recipes(id, name, category, image_url, description, details) VALUES($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, category=EXCLUDED.category,
         image_url=COALESCE(EXCLUDED.image_url, recipes.image_url),
         description=COALESCE(EXCLUDED.description, recipes.description),
         details=COALESCE(EXCLUDED.details, recipes.details),
         deleted_at=NULL`,
      [r.id, r.name, r.category, image_url, description, details]
    );
    // Upsert nutrition per recipe
    const cal = (img as any)?.calories ?? r.calories ?? 0;
    const prot = (img as any)?.protein ?? r.protein ?? 0;
    const carbs = (img as any)?.carbs ?? r.carbs ?? 0;
    const fat = (img as any)?.fat ?? r.fat ?? 0;
    // Try update first
    const upd = await query<{ rowCount:number }>(
      `UPDATE nutrition SET calories=$2, protein_grams=$3, carbs_grams=$4, fat_grams=$5 WHERE recipe_id=$1 RETURNING 1 as rowCount`,
      [r.id, cal, prot, carbs, fat]
    );
    if (!upd.rows.length) {
      await query(
        `INSERT INTO nutrition(recipe_id, calories, protein_grams, carbs_grams, fat_grams)
         VALUES($1,$2,$3,$4,$5)`,
        [r.id, cal, prot, carbs, fat]
      );
    }
  }

  // Demo user
  const email = 'peaceoloruntoba22@gmail.com';
  const name = 'Peace Oloruntoba';
  const password = 'password';
  const password_hash = await bcrypt.hash(password, 10);
  const { rows: users } = await query<{ id:string }>(
    'INSERT INTO users(email, password_hash, name) VALUES($1,$2,$3) ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name RETURNING id',
    [email, password_hash, name]
  );
  const userId = users[0].id;

  // Meal plan aligned with ui.tsx array indices
  const plan = {
    Monday: {
      breakfast: { recipe_id: 2 },
      lunch: { recipe_id: 17 },
      dinner: { recipe_id: 43 },
    },
    Tuesday: {
      breakfast: { recipe_id: 1 },
      lunch: { recipe_id: 18 },
    },
    Wednesday: {
      breakfast: { recipe_id: 3 },
      lunch: { recipe_id: 21 },
      dinner: { recipe_id: 42 },
    },
    Thursday: {
      lunch: { recipe_id: 16 },
    },
    Friday: {
      breakfast: { recipe_id: 5 },
      lunch: { recipe_id: 23 },
    },
    Saturday: {},
    Sunday: {
      lunch: { recipe_id: 20 },
    },
  } as any;

  await query(
    `INSERT INTO user_meal_plans(user_id, plan, updated_at)
     VALUES($1,$2,NOW())
     ON CONFLICT (user_id) DO UPDATE SET plan=EXCLUDED.plan, updated_at=EXCLUDED.updated_at`,
    [userId, plan]
  );

  // Pantry seed (basic demo)
  await query(
    `INSERT INTO pantry_items(user_id, name, quantity, unit)
     VALUES($1,'Rice','2','kg'), ($1,'Plantain','6','pcs')
     ON CONFLICT DO NOTHING`,
    [userId]
  );

  // Shopping seed (basic demo)
  await query(
    `INSERT INTO shopping_items(user_id, name, quantity)
     VALUES($1,'Tomatoes','1 crate'), ($1,'Onions','2 kg')
     ON CONFLICT DO NOTHING`,
    [userId]
  );

  // Stats seed (today)
  const today = new Date().toISOString().slice(0,10);
  await query(
    `INSERT INTO user_stats(user_id, stat_date, calories, protein_grams, carbs_grams, fat_grams)
     VALUES($1,$2,2000,100,250,60)
     ON CONFLICT (user_id, stat_date) DO UPDATE SET calories=EXCLUDED.calories`,
    [userId, today]
  );

  logger.info({ email }, 'Seed complete');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
