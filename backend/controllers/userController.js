import { pool } from "../libs/database.js";
import { comparePassword, hashPassword } from "../libs/index.js";

export const getUser = async(req, res) => {
    try {
        const { userId } = req.body.user;
        res.status(201).json({
            status: "success",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
};

export const changePassword = async(req, res) => {

};

export const updateUser = async(req, res) => {

};

