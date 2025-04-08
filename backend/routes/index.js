import express from "express";
import authRoutes from "./authRoutes.js";
import accountRoutes from "./accountRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import userRoutes from "./userRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import assetRoutes from "./assetRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/transaction", transactionRoutes);
router.use("/user", userRoutes);
router.use("/api/categories", categoryRoutes);
router.use("/api/assets", assetRoutes);

export default router;