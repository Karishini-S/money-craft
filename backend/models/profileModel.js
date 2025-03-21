import { pool } from "../config/database.js"

export const createProfile = async (userId) => {
    const query = `INSERT INTO profile (user_id) VALUES ($1);`;
    await pool.query(query, [userId]);
};

export const updateProfile = async (userId, profileData) => {
    const { isPvt, phNo, age, country, timezone, language, currency, avatar, theme, income } = profileData;
    const query = `
        UPDATE PROFILE 
        SET is_private = $2, ph_no = $3, age = $4, country = $5, time_zone = $6,
            language = $7, currency_type = $8, avatar = $9, theme = $10, income = $11
        WHERE user_id = $1;
    `;
    const values = [userId, isPvt, phNo, age, country, timezone, language, currency, avatar, theme, income];
    await pool.query(query, values);
};