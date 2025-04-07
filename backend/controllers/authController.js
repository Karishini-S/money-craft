import { pool } from '../config/database.js';
import {comparePassword, createJWT, hashPassword} from '../config/index.js';
import { createUser, getUserByEmail } from "../models/UserModel.js";
import { createProfile } from "../models/profileModel.js";

export const signupUser = async (req, res) => {
    try {
        const { email, username, password, confirmPassword } = req.body;
        if (!(password === confirmPassword)) {
            return res.status(400).json({ 
                status: "failed",
                message: "Passwords do not match" 
            });
        }
        if (!(username && email && password && confirmPassword)) {
            return res.status(404).json({ 
                status: "failed", 
                message: "Provide required fields" 
            });
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                status: "failed",
                message: "Email is already registered"
            });
        }
        const hashedPwd = await hashPassword(password);
        const userId = await createUser(email, username, hashedPwd);
        await createProfile(userId);
        const defaultCategories = await pool.query(
            "SELECT category_name, category_type FROM category WHERE user_id = 0"
        );

        for (const cat of defaultCategories.rows) {
            await pool.query(
                `INSERT INTO category (category_name, category_type, user_id)
                VALUES ($1, $2, $3)
                ON CONFLICT (category_name, category_type, user_id) DO NOTHING`,
                [cat.category_name, cat.category_type, userId]
            );
        }
        res.status(201).json({message:"User registered successfully", userId});
    } catch (error) {
        console.error("Error registering user: ", error);
        res.status(500).json({
            status: "Failed",
            error: "Server error"
        })
    }
};

export const signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                status: "failed", 
                message: "Provide required fields" 
            });
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ 
                status: "failed", 
                message: "User not found" 
            });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                status: "failed", 
                message: "Invalid credentials" 
            });
        }

        const token = createJWT({ id: user.user_id, email: user.email_id });

        res.json({
            status: "success",
            message: "Logged in successfully",
            user: {
                id: user.user_id,
                email: user.email_id,
                username: user.username,
            },
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            status: "failed", 
            message: "Internal Server Error" 
        });
    }
};