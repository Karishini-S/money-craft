import express from 'express';
import { fetchAssets, addAsset, deleteAsset } from "../controllers/assetController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/asset", verifyToken, fetchAssets);
router.post("/add", verifyToken, addAsset);
router.post("/delete", verifyToken, deleteAsset);

export default router;