import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL successfully"))
    .catch((err) => console.error("Database connection error:", err));