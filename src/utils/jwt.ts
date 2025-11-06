import jwt, { Secret } from 'jsonwebtoken';
import { env } from '../config/env.js';

export type JwtPayload = { sub: string; email: string };

export function signToken(payload: JwtPayload, expiresIn: string | number = '7d') {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET not set in environment');
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken<T = JwtPayload>(token: string): T {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET not set in environment');
  return jwt.verify(token, env.JWT_SECRET as Secret) as T;
}
