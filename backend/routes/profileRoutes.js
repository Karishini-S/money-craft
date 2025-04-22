import express from "express";
import { getProfile, updateProfile, deleteProfile } from "../controllers/profileController.js";
import verifyToken from "../middleware/authMiddleware.js";
import { pool } from "../config/database.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.post("/delete", verifyToken, deleteProfile);

export default router;
