import rateLimitPkg from 'express-rate-limit';

const rateLimit = (rateLimitPkg as any).default ?? (rateLimitPkg as any);

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
