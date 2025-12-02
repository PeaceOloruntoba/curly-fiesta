import type { Response, NextFunction } from 'express';
import type { AuthedRequest } from '../middlewares/auth.js';
import * as svc from '../services/profileService.js';
import { AppError } from '../utils/appError.js';
import uploadImageBuffer from '../utils/cloudinary.js';

export async function getProfile(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) throw AppError.unauthorized('Unauthorized', 'Please sign in');
    const user = await svc.getUserBasic(userId);
    const profile = await svc.getProfile(userId);
    return res.json({ user, profile });
  } catch (e) { next(e); }
}

export async function updateProfile(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) throw AppError.unauthorized('Unauthorized', 'Please sign in');

    let avatar_url: string | undefined;
    const file = (req as any).file as Express.Multer.File | undefined;
    if (file?.buffer) {
      const uploaded = await uploadImageBuffer(file.buffer, { folder: 'curly-fiesta/avatars' });
      avatar_url = uploaded.secure_url;
    }

    const { bio, health, taste, preferences, avatar_url: avatarFromBody } = (req.body || {}) as any;

    const patch: any = {};
    if (typeof bio !== 'undefined') patch.bio = bio || null;
    if (typeof health !== 'undefined') {
      try { patch.health = typeof health === 'string' ? JSON.parse(health) : health; } catch { throw AppError.badRequest('Invalid health JSON', 'Invalid health'); }
    }
    if (typeof taste !== 'undefined') {
      try { patch.taste = typeof taste === 'string' ? JSON.parse(taste) : taste; } catch { throw AppError.badRequest('Invalid taste JSON', 'Invalid taste'); }
    }
    if (typeof preferences !== 'undefined') {
      try { patch.preferences = typeof preferences === 'string' ? JSON.parse(preferences) : preferences; } catch { throw AppError.badRequest('Invalid preferences JSON', 'Invalid preferences'); }
    }
    if (avatar_url) patch.avatar_url = avatar_url;
    else if (typeof avatarFromBody !== 'undefined') patch.avatar_url = avatarFromBody || null;

    const profile = await svc.upsertProfile(userId, patch);
    const user = await svc.getUserBasic(userId);
    return res.json({ user, profile });
  } catch (e) { next(e); }
}
