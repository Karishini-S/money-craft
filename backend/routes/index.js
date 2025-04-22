import express from "express";
import authRoutes from "./authRoutes.js";
import accountRoutes from "./accountRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import profileRoutes from "./profileRoutes.js"
import categoryRoutes from "./categoryRoutes.js";
import assetRoutes from "./assetRoutes.js";
import goalRoutes from "./goalRoutes.js"
import transferRoutes from "./transferRoutes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/transaction", transactionRoutes);
router.use("/user", profileRoutes);
router.use("/goals", goalRoutes);
router.use("/transfers", transferRoutes);
router.use("/api/categories", categoryRoutes);
router.use("/api/assets", assetRoutes);
router.use("/api/transactions", transactionRoutes);
router.use("/api/goals", goalRoutes);

export default router;