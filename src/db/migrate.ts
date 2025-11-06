import { pool, query } from './pool.js';
import { logger } from '../config/logger.js';
import { hasDb } from '../config/env.js';
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureSchemaTable() {
  await query(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  );
}

async function appliedMigrations(): Promise<Set<string>> {
  const { rows } = await query<{ name: string }>('SELECT name FROM schema_migrations');
  return new Set(rows.map((r) => r.name));
}

export async function ensureMigrations() {
  if (!hasDb) {
    logger.warn('Skipping migrations because DATABASE_URL is not configured');
    return;
  }
  await ensureSchemaTable();
  const dir = path.join(__dirname, 'migrations');
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {}

  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.sql')).sort();
  const done = await appliedMigrations();

  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await fs.readFile(path.join(dir, file), 'utf8');
    logger.info({ migration: file }, 'Applying migration');
    await pool.query('BEGIN');
    try {
      await pool.query(sql);
      await pool.query('INSERT INTO schema_migrations(name) VALUES($1)', [file]);
      await pool.query('COMMIT');
      logger.info({ migration: file }, 'Applied migration');
    } catch (err) {
      await pool.query('ROLLBACK');
      logger.error({ err, migration: file }, 'Failed migration');
      throw err;
    }
  }
}
