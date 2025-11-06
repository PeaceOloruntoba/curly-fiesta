import 'dotenv/config';
import { ensureMigrations } from './migrate.js';
import { logger } from '../config/logger.js';

(async () => {
  try {
    await ensureMigrations();
    logger.info('Migrations complete');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Migration failed');
    process.exit(1);
  }
})();
