import { fetchUserAssets, addUserAsset, deleteUserAsset } from "../models/assetModel.js"

export const fetchAssets = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(400).json({
                status: "failed",
                message: "User not found"
            });
        }
        const result = await fetchUserAssets(userId);
        res.status(200).json({ 
            income: [], 
            expense: [], 
            assets: result.rows
        })
    } catch (error) {
        console.error("Error in fetchAssets:", error.message);
        res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
};

export const addAsset = async (req, res) => {
    const userId = req.user.userId;
    const { name, minBal } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Missing required fields"});
    }
    try {
        const result = await addUserAsset(userId, name, minBal);
        res.status(201).json(result[0]);
    } catch (error) {
        console.error("Error adding asset:", error.message);
        res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
};

export const deleteAsset = async (req, res) => {
    const userId = req.user.userId;
    const { name } = req.body;
    try {
        const result = await deleteUserAsset(userId, name);
        if (result.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "Asset not found"
            });
        }
        res.status(200).json({
            status: "success",
            message: "Asset deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting asset:", error.message);
        res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
};