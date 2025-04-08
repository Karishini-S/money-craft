import { pool } from "../config/database.js";

const defaultAssets = {
  asset: ["Cash", "Card", "Savings", "Other"]
};

async function seedDefaults() {
  for (const [type, names] of Object.entries(defaultAssets)) {
    for (const name of names) {
      await pool.query(
        `INSERT INTO default_asset (dasset_name) 
         VALUES ($1)`,
        [name]
      );
    }
  }
  process.exit();
}

seedDefaults();