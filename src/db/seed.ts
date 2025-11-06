import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { query } from './pool.js';
import { logger } from '../config/logger.js';

async function main() {
  logger.info('Starting seed...');
  // Ensure basic recipes exist
  await query(`
    INSERT INTO recipes(name, category) VALUES
    ('Akara','breakfast'),
    ('Moi Moi','breakfast'),
    ('Efo Riro','lunch')
    ON CONFLICT DO NOTHING;
  `);

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

  // Pantry seed
  await query(
    `INSERT INTO pantry_items(user_id, name, quantity, unit)
     VALUES($1,'Rice','2','kg'), ($1,'Plantain','6','pcs')
     ON CONFLICT DO NOTHING`,
    [userId]
  );

  // Shopping seed
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
