import { pool } from "../config/database.js";

export async function assignDefaultCategoriesToUser(userId) {
  const { rows: defaults } = await pool.query(`SELECT dcat_id, dcat_name, dcat_type FROM default_category`);
  
  const inserts = defaults.map(dc =>
    pool.query(
      `INSERT INTO user_category (user_id, dcat_id, cat_name, cat_type, is_default)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, dc.dcat_id, dc.dcat_name, dc.dcat_type, true]
    )
  );

  await Promise.all(inserts);
}

export async function getUserCategories(userId) {
    const defaultIncomeCategories = await pool.query(
        `SELECT dcat_id AS cat_id, dcat_name AS cat_name, dcat_type AS cat_type FROM default_category WHERE dcat_type='income'`
    );
    const defaultExpenseCategories = await pool.query(
        `SELECT dcat_id AS cat_id, dcat_name AS cat_name, dcat_type AS cat_type FROM default_category WHERE dcat_type='expense'`
    );
    const incomeResult = await pool.query(
        `SELECT * FROM user_category WHERE user_id=$1 AND cat_type='income'`, [userId]
    );
    const expenseResult = await pool.query(
        `SELECT * FROM user_category WHERE user_id=$1 AND cat_type='expense'`, [userId]
    );
    const income = [...defaultIncomeCategories.rows, ...incomeResult.rows];
    const expense = [...defaultExpenseCategories.rows, ...expenseResult.rows]
    return { income, expense };
    /*const result = await pool.query(
      `SELECT 
          uc.cat_id, 
          COALESCE(dc.dcat_name, uc.cat_name) AS category_name, 
          uc.cat_type, 
          uc.is_default
       FROM user_category uc 
       LEFT JOIN default_category dc 
       ON uc.dcat_id = dc.dcat_id 
       WHERE uc.user_id = $1`,
      [userId]
    );
    return result.rows;*/
};

export async function getUserCategoriesByType(userId, type) {
    const result = await pool.query(
        `SELECT * FROM user_category WHERE user_id=$1 AND cat_type=$2`, [userId, type]
    );
    return result;
};

export async function addUserCategory(userId, cat_name, cat_type) {
    const result = await pool.query(
        `INSERT INTO user_category (user_id, cat_name, cat_type, is_default)
        VALUES ($1, $2, $3, false) RETURNING *`, [userId, cat_name, cat_type]
    );
    return result.rows;
};

export async function deleteUserCategory(userId, cat_name, cat_type) {
    const result = await pool.query(
        `DELETE FROM user_category WHERE user_id=$1 AND cat_name=$2 AND cat_type=$3
        RETURNING *;`, [userId, cat_name, cat_type]
    );
    return result.rows;
};
