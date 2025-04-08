import { pool } from "../config/database.js";

const defaultCategories = {
  income: ["Salary", "Freelance", "Investments", "Bonus", "Other"],
  expense: ["Food", "Transport", "Rent", "Entertainment", "Other"],
};

async function seedDefaults() {
  for (const [type, names] of Object.entries(defaultCategories)) {
    for (const name of names) {
      await pool.query(
        `INSERT INTO default_category (dcat_name, dcat_type) 
         VALUES ($1, $2)`,
        [name, type]
      );
    }
  }
  process.exit();
}

seedDefaults();