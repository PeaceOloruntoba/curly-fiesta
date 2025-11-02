import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger, logger } from './config/logger.js';
import { rateLimiter } from './middlewares/rateLimit.js';
import { errorHandler, notFound } from './middlewares/error.js';
import v1 from './routes/v1.js';
import { ensureMigrations } from './db/migrate.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);
app.use(rateLimiter);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'curly-fiesta-api' });
});

app.use('/api/v1', v1);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 4000);

(async () => {
  try {
    await ensureMigrations();
    app.listen(PORT, () => {
      logger.info({ port: PORT }, `API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
})();
