import { z } from 'zod';
import * as crypto from 'crypto';
import { logger } from './logger.js';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().optional(),
  // Make DATABASE_URL optional to allow the server to start without a DB in local/dev.
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL' }).optional(),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  OTP_TTL_MINUTES: z.string().default('10'),
  CORS_ORIGIN: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_FOLDER: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

// Prepare a mutable copy of process.env for defaults
const raw = { ...process.env } as Record<string, string | undefined>;

// Auto-generate a dev/test JWT secret when missing to avoid startup crashes
if (!raw.JWT_SECRET && (raw.NODE_ENV ?? 'development') !== 'production') {
  raw.JWT_SECRET = crypto.randomBytes(32).toString('hex');
  // eslint-disable-next-line no-console
  console.warn('[env] JWT_SECRET was not set. Generated a temporary dev secret. Tokens will reset on restart.');
}

export const env: Env = EnvSchema.parse(raw);

export const isProd = env.NODE_ENV === 'production';
export const hasDb = !!env.DATABASE_URL;
