import { pool } from "../config/database.js";

export const createTransfer = async (req, res) => {
    const userId = req.user.userId;
    console.log(req.user);
    const { sourceAssetId, destinationAssetId, amount, description } = req.body;

    if (!sourceAssetId || !destinationAssetId || !amount) {
        return res.status(400).json({ error: "Invalid transfer data." });
    }

    if (sourceAssetId === destinationAssetId) {
        return res.status(400).json({ error: "Source and destination assets must differ." });
    }
    
    const assetQuery = await pool.query(
        `SELECT current_balance, min_balance FROM asset WHERE asset_id = $1 AND user_id = $2`,
        [sourceAssetId, userId]
    );
    const source = assetQuery.rows[0];
    
    if (!source) {
        return res.status(404).json({ error: "Source asset not found." });
    }
    
    if (source.current_balance < amount) {
        return res.status(400).json({ error: "Insufficient funds." });
    }
    
    if ((source.current_balance - amount) < source.min_balance) {
        return res.status(400).json({ error: "Transfer drops balance below minimum." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO transfer (user_id, source_asset_id, destination_asset_id, amount, description)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [userId, sourceAssetId, destinationAssetId, amount, description]
        );

        res.status(201).json({ message: 'Transfer successful', transfer: result.rows[0] });
    } catch (err) {
        console.error("Transfer error:", err);
        res.status(500).json({ error: "Server error during transfer" });
    }
};
