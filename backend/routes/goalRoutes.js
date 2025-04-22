import express from "express";
import { createGoal, getGoals } from "../controllers/goalController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, createGoal);
router.get("/user-goals", verifyToken, getGoals);

export default router;
