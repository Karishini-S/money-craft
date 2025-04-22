import { pool } from "../config/database.js";
import { getAssetId } from "./transactionModel.js";

export const createUserGoal = async (userId, name, amount) => {
    const asset_id = await getAssetId(userId, 'Savings');
    const query = `
        INSERT INTO goal (user_id, asset_id, goal_type, target_amount, 
        current_amount, goal_name, difficulty_level)
        VALUES ($1, $2, 'savings', $3, 0, $4, 'beginner')
    `;
    const result = await pool.query(query, [userId, asset_id, amount, name]);
    return result.rows[0];
};

export const getUserGoal = async (userId) => {
    const query = `
        SELECT goal_id as id, ROUND(target_amount, 2) AS target_amount, ROUND(current_amount, 2) AS current_amount, 
                CONCAT('Goal: ', ROUND(current_amount, 2), ' / ', ROUND(target_amount, 2), ' saved') AS goal
            FROM goal
            WHERE asset_id IN (
            SELECT asset_id FROM assets WHERE user_id = $1
            )
    `;
    const result = await pool.query(query, [userId]);
    return result;
};