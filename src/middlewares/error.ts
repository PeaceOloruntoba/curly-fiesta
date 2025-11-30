import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.js';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Not Found', errorMessage: 'Resource not found' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Normalize common DB errors (e.g., duplicate key)
  if (err?.code === '23505') {
    err.status = err.status || 409;
    err.message = err.detail || 'Duplicate key';
    err.errorMessage = 'Already exists';
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errorMessage = err.errorMessage || (status === 401 ? 'Please sign in' : status === 403 ? 'You do not have permission' : status === 404 ? 'Resource not found' : 'Something went wrong');
  logger.error({ err, status }, message);
  res.status(status).json({ error: message, errorMessage });
}
