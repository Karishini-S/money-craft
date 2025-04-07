import express from "express";
import { addTransactions } from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add",addTransactions);

export default router;