import { getMonthName } from "../config/index.js";
import { pool } from "../config/database.js";

export const getTransactions = async (req, res) => {
    try {
        const today = new Date();
        const _sevenDaysAgo = new Date(today);
        _sevenDaysAgo.setDate(today.getDate() - 7);
        const sevenDaysAgo = _sevenDaysAgo.toISOString().split("T")[0];
        const { df, dt, s } = req.query;
        const { userId } = req.body.user;
        const startDate = new Date(df || sevenDaysAgo);
        const endDate = new Date(dt || new Date());
        res.status(200).json({
            status: "success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        });
    }
}