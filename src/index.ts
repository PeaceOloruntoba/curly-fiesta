import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmetPkg from 'helmet';
import { requestLogger, logger } from './config/logger.js';
import { rateLimiter } from './middlewares/rateLimit.js';
import { errorHandler, notFound } from './middlewares/error.js';
import v1 from './routes/v1.js';
import { ensureMigrations } from './db/migrate.js';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';

const helmet = (helmetPkg as any).default ?? (helmetPkg as any);

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(requestLogger);
app.use(rateLimiter);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'curly-fiesta-api' });
});

app.use('/v1', v1);

app.use(notFound);
app.use(errorHandler);

// Export app for serverless platforms (e.g., Vercel)
export default app;

// Start HTTP server only when running as a standalone process (dev/prod server)
if (!process.env.VERCEL) {
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
}
