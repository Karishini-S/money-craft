import { pool } from '../libs/database.js';
import {comparePassword, createJWT, hashPassword} from '../libs/index.js';

export const signupUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        if (!(password === confirmPassword)) {
            return res.status(400).json({ 
                status: "failed",
                message: "Passwords do not match" 
            });
        }
        if (!(firstName && email && password && confirmPassword)) {
            return res.status(404).json({ 
                status: "failed", 
                message: "Provide required fields" 
            });
        }
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                status: "failed",
                message: "Email already registered"
            });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await pool.query(
            "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [firstName, lastName, email, hashedPassword]
        );
        const token = createJWT({ id: newUser.rows[0].id });
        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            user: newUser.rows[0],
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        });
    }
};

export const signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                status: "failed", 
                message: "Provide email and password" 
            });
        }

        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                status: "failed", 
                message: "User not found" 
            });
        }

        const user = rows[0];

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                status: "failed", 
                message: "Invalid credentials" 
            });
        }

        const token = createJWT({ id: user.id, email: user.email });

        res.json({
            status: "success",
            message: "Logged in successfully",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
            },
            token
        });

    } catch (error) {
        res.status(500).json({ 
            status: "failed", 
            message: "Internal Server Error" 
        });
    }
};