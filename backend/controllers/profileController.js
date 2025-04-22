import { pool } from "../config/database.js";

export const getProfile = async (req, res) => {
    const userId = req.user.userId;
    try {
        const result = await pool.query("SELECT * FROM profile WHERE user_id = $1", [userId]);
        res.status(200).json({ profile: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};

export const updateProfile = async (req, res) => {
    const userId = req.user.userId;
    const {
        is_private, ph_no, age, country, time_zone, language,
        currency_type, avatar, theme, income_level
    } = req.body;

    try {
        await pool.query(
            `UPDATE profile SET
                is_private = $1,
                ph_no = $2,
                age = $3,
                country = $4,
                time_zone = $5,
                language = $6,
                currency_type = $7,
                avatar = $8,
                theme = $9,
                income_level = $10
            WHERE user_id = $11`,
            [
                is_private, ph_no, age, country, time_zone, language,
                currency_type, avatar, theme, income_level, userId
            ]
        );
        res.status(200).json({ message: "Profile updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
};

export const deleteProfile = async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(400).send("User ID is required");
    }

    try {
        const result = await pool.query("DELETE FROM users WHERE user_id=$1", [userId]);
        console.log("DELETED:", result.rowCount); // Log how many rows were affected
        if (result.rowCount === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).send("User deleted successfully");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
}