import { error } from "console";
import { pool } from "../config/database.js";
import { 
    getAssetId, 
    getCategoryId, 
    getAssetById, 
    getCategoryById, 
    addIncome, 
    addExpense, 
    getTransaction,
    deleteIncome,
    deleteExpense
} from "../models/transactionModel.js";

export const addTransactions = async(req, res) => {
    try {
        const {asset_id, category_id, amount} = req.body;
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
            transaction = await addIncome(asset_id, category_id, amount);
        } else if (category.category_type === "expense") {
            if (asset.current_balance < amount) {
                return res.status(400).json({
                    status: "failed",
                    message: "Insufficient balance"
                })
            }
            transaction = await addExpense(asset_id, category_id, amount);
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

export const getRecentTransac = async(req, res) => {
    const userId = req.user.userId;
    try {
        const result = await getTransaction(userId);
        return res.status(200).json({ transactions: result });
    } catch (error) {
        console.error("Recent fetch error:", error.message);
        return res.status(500).json({ message: "Failed to load recent transactions." });
    }
}

export const addIncomeTransac = async(req, res) => {
    const {asset, category, amount} = req.body;
    const userId = req.user.userId;
    try {
        const asset_id = await getAssetId(userId, asset);
        const category_id = await getCategoryId(userId, category, 'income');
        if (!asset_id || !category_id) {
            return res.status(400).json({ message: "Asset or category not found." });
        }
        const result = await addIncome(userId, asset_id, category_id, amount);

        // After inserting income
        await pool.query(`
            UPDATE goal
            SET 
                current_amount = current_amount + $1,
                is_achieved = CASE WHEN current_amount + $1 >= target_amount THEN TRUE ELSE is_achieved END
            WHERE asset_id = $2 AND user_id = $3
        `, [amount, asset_id, userId]);

        res.status(201).json({ message: "Income added", transaction: result });
    } catch (error) {
        console.error("Add income error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addExpenseTransac = async(req, res) => {
    const {asset, category, amount} = req.body;
    const userId = req.user.userId;
    try {
        const asset_id = await getAssetId(userId, asset);
        const category_id = await getCategoryId(userId, category, 'expense');
        if (!asset_id || !category_id) {
            return res.status(400).json({ message: "Asset or category not found." });
        }
        const assetData = await pool.query(
            `SELECT current_balance, minimum_balance FROM assets WHERE asset_id = $1 AND user_id = $2`,
            [asset_id, userId]
        );

        if (assetData.rowCount === 0) {
            return res.status(404).json({ message: "Asset not found for the user." });
        }

        const { current_balance, minimum_balance } = assetData.rows[0];
        const availableBalance = Number(current_balance) - Number(minimum_balance);

        if (Math.abs(amount) > availableBalance) {
            return res.status(400).json({ message: "Insufficient balance considering minimum balance." });
        }
        
        const result = await addExpense(userId, asset_id, category_id, Math.abs(amount));
        console.log(amount);
        await pool.query(`
            UPDATE goal
            SET current_amount = current_amount - $2
            WHERE asset_id = $3 AND user_id = $1
        `, [userId, Math.abs(amount), asset_id]);
        res.status(201).json({ message: "Expense added", transaction: result });
    } catch (error) {
        console.error("Add expense error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteIncomeTransac = async(req, res) => {
    const userId = req.user.userId;
    const { transac_id } = req.body;
    try {
        await deleteIncome(userId, transac_id);
        res.status(200).json({ message: "Income transaction deleted" });
    } catch (error) {
        console.error("Delete income error:", error);
        res.status(500).json({ error: "Failed to delete income transaction" });
    }
};

export const deleteExpenseTransac = async(req, res) => {
    const userId = req.user.userId;
    const { transac_id } = req.body;
    try {
        await deleteExpense(userId, transac_id);
        res.status(200).json({ message: "Expense transaction deleted" });
    } catch (error) {
        console.error("Delete expense error:", error);
        res.status(500).json({ error: "Failed to delete expense transaction" });
    }
}