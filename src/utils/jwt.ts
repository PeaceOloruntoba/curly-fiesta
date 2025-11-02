import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type JwtPayload = { sub: string; email: string };

export function signToken(payload: JwtPayload, expiresIn: string = '7d') {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function verifyToken<T = JwtPayload>(token: string): T {
  return jwt.verify(token, env.JWT_SECRET) as T;
}
