import { pool } from "../config/database.js";

export const getAssetId = async(userId, asset_name) => {
    const result = await pool.query(
        `SELECT asset_id FROM assets WHERE user_id = $1 AND asset_name = $2`,
        [userId, asset_name]
    );
    return result.rows[0].asset_id;
}

export const getCategoryId = async(userId, cat_name, cat_type) => {
    const result = await pool.query(
        `SELECT cat_id FROM user_category WHERE user_id = $1 AND cat_name = $2 AND cat_type=$3`,
        [userId, cat_name, cat_type]
    );
    return result.rows[0].cat_id;
}

export const getAssetById = async(userId, asset_id) => {
    const result = await pool.query("SELECT * FROM assets WHERE user_id = $1 AND asset_id = $2", [userId, asset_id]);
    return result.rows[0];
}

export const getCategoryById = async(userId, category_id) => {
    const result = await pool.query("SELECT * FROM category WHERE user_id = $1 AND category_id = $2", [userId, category_id]);
    return result.rows[0];    
}

export const addIncome = async(userId, asset_id, category_id, amount) => {
    const query = `
        INSERT INTO income (user_id, asset_id, category_id, amount) 
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [userId, asset_id, category_id, amount];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const addExpense = async(userId, asset_id, category_id, amount) => {
    const query = `
        INSERT INTO expense (user_id, asset_id, category_id, amount) 
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [userId, asset_id, category_id, Math.abs(amount)];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export const getTransaction = async (userId) => {
    const query = `
        SELECT 
            i.income_id AS id,
            'income' AS type,
            i.amount,
            i.transaction_on AS date,
            COALESCE(uc.cat_name, dc.dcat_name, 'Income') AS category,
            a.asset_name
        FROM income i
        JOIN assets a ON i.asset_id = a.asset_id
        LEFT JOIN user_category uc ON i.category_id = uc.cat_id
        LEFT JOIN default_category dc ON i.category_id = dc.dcat_id
        WHERE a.user_id = $1

        UNION ALL

        SELECT 
            e.expense_id AS id,
            'expense' AS type,
            e.amount,
            e.transaction_on AS date,
            COALESCE(uc.cat_name, dc.dcat_name, 'Expense') AS category,
            a.asset_name
        FROM expense e
        JOIN assets a ON e.asset_id = a.asset_id
        LEFT JOIN user_category uc ON e.category_id = uc.cat_id
        LEFT JOIN default_category dc ON e.category_id = dc.dcat_id
        WHERE a.user_id = $1

        ORDER BY date DESC;
    `;

    const { rows } = await pool.query(query, [userId]);
    return rows;
};

export const deleteIncome = async (userId, transac_id) => {
    const query = `
        DELETE FROM income WHERE user_id = $1 AND income_id = $2;
    `;
    await pool.query(query, [userId, transac_id]);
};

export const deleteExpense= async (userId, transac_id) => {
    const query = `
        DELETE FROM expense WHERE user_id = $1 AND expense_id = $2;
    `;
    await pool.query(query, [userId, transac_id]);
};