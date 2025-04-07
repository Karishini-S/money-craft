import { pool } from "../config/database.js";
import { getAssetById, getCategoryById, addIncome, addExpense } from "../models/transactionModel.js";

export const addTransactions = async(req, res) => {
    try {
        const {asset_id, category_id, amount, description} = req.body;
        if (!asset_id || !category_id || !amount) {
            return res.status(400).json({
                status: "failed",
                message: "Provide required fields"
            })
        }

        const asset = await getAssetById(asset_id);
        if (!asset) {
            return res.body.status(404).json({
                status: "failed",
                message: "Asset not found"
            })
        }

        const category = await getCategoryById(category_id);
        if(!category) {
            return res.status(404).json({
                status: "failed",
                message: "Category not found"
            })
        }

        let transaction;
        
        if (category.category_type === "income") {
            transaction = await addIncome(asset_id, category_id, amount, description);
        } else if (category.category_type === "expense") {
            if (asset.current_balance < amount) {
                return res.status(400).json({
                    status: "failed",
                    message: "Insufficient balance"
                })
            }
            transaction = await addExpense(asset_id, category_id, amount, description);
        }
        res.status(201).json({
            status: "success",
            message: "Transaction added successfully"
        })
    } catch(error) {
        console.error("Transaction error:", error);
        res.status(500).json({
            status: "failed",
            message: "Server error"
        })
    }
};