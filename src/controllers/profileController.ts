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
    // Accept user fields either nested or top-level
    const userPatch = (req.body && typeof req.body.user === 'object') ? req.body.user as any : {};
    const first_name = (req.body as any).first_name ?? userPatch.first_name;
    const last_name = (req.body as any).last_name ?? userPatch.last_name;

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

    // Optional normalized fields
    const allowed = [
      'age','gender','height_cm','weight_kg','activity_level','health_goals','food_allergies','medical_dietary_restrictions','preferred_calorie_range','macronutrient_focus',
      'favorite_flavors','cuisine_preferences','heat_tolerance','texture_preference','foods_loved','foods_disliked','snack_personality',
      'meal_prep_style','cooking_skill_level','budget_level','meals_per_day','diet_type','household_size','shopping_frequency','kitchen_equipment_available','leftovers_preference',
    ] as const;
    const numberFields = new Set(['age','height_cm','weight_kg','meals_per_day']);
    const arrayFields = new Set([
      'health_goals','food_allergies','medical_dietary_restrictions','macronutrient_focus',
      'favorite_flavors','cuisine_preferences','texture_preference','foods_loved','foods_disliked','kitchen_equipment_available',
    ]);
    for (const key of allowed) {
      const raw = (req.body as any)[key];
      if (typeof raw === 'undefined') continue;
      if (raw === null || raw === '') { patch[key] = null; continue; }
      if (numberFields.has(key)) {
        const n = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
        patch[key] = Number.isNaN(n) ? null : n;
        continue;
      }
      if (arrayFields.has(key)) {
        if (Array.isArray(raw)) patch[key] = raw.map(String);
        else if (typeof raw === 'string') {
          // try JSON parse, else comma-separated
          try {
            const parsed = JSON.parse(raw);
            patch[key] = Array.isArray(parsed) ? parsed.map(String) : [String(raw)];
          } catch {
            patch[key] = raw.split(',').map((s) => s.trim()).filter(Boolean);
          }
        } else {
          patch[key] = [String(raw)];
        }
        continue;
      }
      patch[key] = raw;
    }

    const profile = await svc.upsertProfile(userId, patch);
    if (typeof first_name !== 'undefined' || typeof last_name !== 'undefined') {
      await svc.updateUserBasic(userId, { first_name: first_name ?? undefined, last_name: last_name ?? undefined });
    }
    const user = await svc.getUserBasic(userId);
    return res.json({ user, profile });
  } catch (e) { next(e); }
}
