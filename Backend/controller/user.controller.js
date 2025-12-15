import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, findUserById, getAllUsers as getAllUsersModel } from "../models/user.model.js";
import { createUserService, updateUserService } from "../services/user.service.js";
import { addToken } from "../models/blacklistedTokens.js";

/**
 * SIGNUP - Create a new user
 */
export const signup = async (req, res) => {
    try {
        const { fullname, email, password, designation } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await createUserService(fullname, email, hashedPassword, designation);

        // Create JWT token
        const token = jwt.sign({ id: newUser.id, role: designation }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser.id,
                fullname: newUser.fullname,
                email: newUser.email,
                designation: newUser.designation,
            },
        });
    } catch (error) {
        console.error("❌ Signup Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * LOGIN - Authenticate a user
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.designation }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                designation: user.designation,
            },
        });
    } catch (error) {
        console.error("❌ Login Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * LOGOUT - Blacklist JWT token
 */
export const logout = async (req, res) => {
    try {
        const token = req.token;
        if (!token) return res.status(400).json({ message: "Token not provided" });

        await addToken(token);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("❌ Logout Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * GET ALL USERS - Admin only
 */
export const getAllUsers = async (req, res) => {
    try {
        const users =
