import express from "express";
import { createTransfer } from "../controllers/transferController.js"
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/', verifyToken, createTransfer);

export default router;