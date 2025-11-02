import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.js';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not Found' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  logger.error({ err, status }, message);
  res.status(status).json({ error: message });
}
