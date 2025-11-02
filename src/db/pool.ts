import { Pool } from 'pg';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export const pool = new Pool({ connectionString: env.DATABASE_URL, max: 10 });

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected PG pool error');
});

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }>{
  return pool.query(text, params);
}
