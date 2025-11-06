import { Pool } from 'pg';
import { env, hasDb } from '../config/env.js';
import { logger } from '../config/logger.js';

export const pool = hasDb
  ? new Pool({ connectionString: env.DATABASE_URL, max: 10 })
  : (null as unknown as Pool);

if (hasDb) {
  pool.on('error', (err: unknown) => {
    logger.error({ err }, 'Unexpected PG pool error');
  });
} else {
  logger.warn('DATABASE_URL not set; running without database connection');
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }>{
  if (!hasDb) {
    const err = new Error('Database is not configured. Set DATABASE_URL to enable DB queries.');
    logger.error({ sql: text, params }, 'Attempted to run query without a database');
    throw err;
  }
  return (await pool.query(text, params)) as unknown as { rows: T[] };
}
