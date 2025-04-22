import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import routes from "./routes/index.js"; 
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import assets from "./routes/assetRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Consolidating routes
app.use("/api", routes);
app.use("/api/auth", authRoutes); // Merged from server.js
app.use("/api/categories", categoryRoutes);
app.use("/api/assets", assets);
app.use("/api/transactions", transactionRoutes)

// Handle 404 errors
app.use("*", (req, res) => {
  res.status(404).json({
    status: "404 Not found",
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
