import pino from 'pino';
import pinoHttp from 'pino-http';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
      }
    : undefined,
});

export const requestLogger = pinoHttp({
  logger,
  autoLogging: true,
});
