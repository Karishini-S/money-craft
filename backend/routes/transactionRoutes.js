import express from "express";
import { 
    addTransactions, 
    getRecentTransac, 
    addIncomeTransac, 
    addExpenseTransac,
    deleteIncomeTransac,
    deleteExpenseTransac
} from "../controllers/transactionController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add",addTransactions);
router.get("/recent", verifyToken, getRecentTransac);
router.post("/income", verifyToken, addIncomeTransac);
router.post("/expense", verifyToken, addExpenseTransac);
router.post("/delete-income", verifyToken, deleteIncomeTransac);
router.post("/delete-expense", verifyToken, deleteExpenseTransac);

export default router;