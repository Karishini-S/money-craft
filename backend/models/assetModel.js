import { pool } from '../config/database.js';

export async function addUserAsset (userId, assetName, minBal) {
    const result = await pool.query(
        `INSERT INTO assets (user_id, asset_name, minimum_balance)
        VALUES ($1, $2, $3) RETURNING *`, [userId, assetName, minBal], 
    );
    return result.rows;
};

export async function deleteUserAsset (userId, assetName) {
    const result = await pool.query(
        `DELETE FROM assets WHERE user_id=$1 AND asset_name=$2 RETURNING *`,
        [userId, assetName]
    );
    return result.rows;
};

export async function fetchUserAssets (userId) {
    const result = await pool.query(
        `SELECT * FROM assets WHERE user_id=$1`, [userId]
    );
    return result;
};