import { pool } from "../config/database.js";

export const getAssetById = async(asset_id) => {
    const result = await pool.query("SELECT * FROM assets WHERE asset_id = $1", [asset_id]);
    return result.rows[0];
}

export const getCategoryById = async(category_id) => {
    const result = await pool.query("SELECT * FROM category WHERE category_id = $1", [category_id]);
    return result.rows[0];    
}

export const addIncome = async(asset_id, category_id, amount, description) => {
    const query = `
        INSERT INTO income (asset_id, category_id, amount, description) 
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [asset_id, category_id, amount, description];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const addExpense = async(asset_id, category_id, amount, description) => {
    const query = `
        INSERT INTO expense (asset_id, category_id, amount, description) 
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [asset_id, category_id, amount, description];
    const result = await pool.query(query, values);
    return result.rows[0];
}