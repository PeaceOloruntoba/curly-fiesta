import type { Request, Response } from 'express';
export function methodNotAllowed(_req: Request, res: Response) {
  return res.status(405).json({ error: 'Method Not Allowed' });
}
