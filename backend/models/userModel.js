import { pool } from '../config/database.js'

export const createUser = async (email, username, hashedPwd) => {
    const query = `
        INSERT INTO "users" (email_id, username, password)
        VALUES ($1, $2, $3) RETURNING user_id;
    `;
    const values = [email, username, hashedPwd];
    const result = await pool.query(query, values);
    return result.rows[0].user_id;
}

export const getUserByEmail = async(email) => {
    const query = `SELECT * FROM "users" WHERE email_id = $1;`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
}