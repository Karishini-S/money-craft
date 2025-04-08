// backend/routes/categoryRoutes.js
import express from "express";
import { fetchCategories, fetchCategoryByType, addCategory, deleteCategory } from "../controllers/categoryController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/category", verifyToken, fetchCategories);
router.get("/category/:type", verifyToken, fetchCategoryByType);
router.post("/add", verifyToken, addCategory);
router.post("/delete", verifyToken, deleteCategory);

export default router;
