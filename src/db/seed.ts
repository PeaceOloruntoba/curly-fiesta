import "dotenv/config";
import { query } from "./pool.js";
import { logger } from "../config/logger.js";
import { RECIPES } from "../data/recipe_details.js";

async function main() {
  logger.info("Starting seed...");

  for (const r of RECIPES) {
    const existing = await query(`SELECT name FROM recipes WHERE id = $1`, [
      r.id,
    ]);

    if (existing.rows.length > 0) {
      // Update description and details; optionally update name too
      await query(
        `UPDATE recipes
       SET name = $1, description = $2, details = $3, deleted_at = NULL
       WHERE id = $4`,
        [r.name, r.description, r.details, r.id]
      );
    } else {
      // Insert new recipe
      await query(
        `INSERT INTO recipes(id, name, description, details)
       VALUES($1, $2, $3, $4)`,
        [r.id, r.name, r.description, r.details]
      );
    }
  }

  logger.info("Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
