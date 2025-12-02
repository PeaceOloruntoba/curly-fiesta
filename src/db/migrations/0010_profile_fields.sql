-- 0010_profile_fields.sql
-- Add normalized optional fields to profiles while keeping JSONB columns

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS height_cm INTEGER,
  ADD COLUMN IF NOT EXISTS weight_kg INTEGER,
  ADD COLUMN IF NOT EXISTS activity_level TEXT,
  ADD COLUMN IF NOT EXISTS health_goals TEXT[],
  ADD COLUMN IF NOT EXISTS food_allergies TEXT[],
  ADD COLUMN IF NOT EXISTS medical_dietary_restrictions TEXT[],
  ADD COLUMN IF NOT EXISTS preferred_calorie_range TEXT,
  ADD COLUMN IF NOT EXISTS macronutrient_focus TEXT[],

  ADD COLUMN IF NOT EXISTS favorite_flavors TEXT[],
  ADD COLUMN IF NOT EXISTS cuisine_preferences TEXT[],
  ADD COLUMN IF NOT EXISTS heat_tolerance TEXT,
  ADD COLUMN IF NOT EXISTS texture_preference TEXT[],
  ADD COLUMN IF NOT EXISTS foods_loved TEXT[],
  ADD COLUMN IF NOT EXISTS foods_disliked TEXT[],
  ADD COLUMN IF NOT EXISTS snack_personality TEXT,

  ADD COLUMN IF NOT EXISTS meal_prep_style TEXT,
  ADD COLUMN IF NOT EXISTS cooking_skill_level TEXT,
  ADD COLUMN IF NOT EXISTS budget_level TEXT,
  ADD COLUMN IF NOT EXISTS meals_per_day INTEGER,
  ADD COLUMN IF NOT EXISTS diet_type TEXT,
  ADD COLUMN IF NOT EXISTS household_size TEXT,
  ADD COLUMN IF NOT EXISTS shopping_frequency TEXT,
  ADD COLUMN IF NOT EXISTS kitchen_equipment_available TEXT[],
  ADD COLUMN IF NOT EXISTS leftovers_preference TEXT;
