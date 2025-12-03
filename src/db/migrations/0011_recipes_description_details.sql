-- 0011_recipes_description_details.sql
-- Add description and details to recipes

ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS details TEXT; -- store HTML from editor
