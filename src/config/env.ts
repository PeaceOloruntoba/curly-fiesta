import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().optional(),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL' }),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  OTP_TTL_MINUTES: z.string().default('10'),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);

export const isProd = env.NODE_ENV === 'production';
