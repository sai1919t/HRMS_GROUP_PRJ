import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, getAllUsers as getAllUsersModel } from "../models/user.model.js";
import { createUserService, updateUserService } from "../services/user.service.js";
import { addToken } from "../models/blacklistedTokens.js";

export const signup = async (req, res) => {
    try {
        console.log("DATABASE_URL =", process.env.DATABASE_URL);
        const { fullname, email, password, designation } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newUser = await createUserService(fullname, email, password, designation);

        console.log("--------------------------------------------------");
        console.log("🆕 NEW USER SIGNUP");
        console.log(`👤 Name: ${newUser.fullname}`);
        console.log(`📧 Email: ${newUser.email}`);
        console.log(`🏷️ Designation: ${newUser.designation}`);
        console.log(`🕒 Time: ${new Date().toLocaleString()}`);
        console.log("--------------------------------------------------");

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser.id,
                fullname: newUser.fullname,
                email: newUser.email,
                designation: newUser.designation
            }
        });
    } catch (error) {
        console.error("❌ Signup Error:", error.message);
        if (error.message === "User already exists") {
            return res.status(400).json({ message: "User already exists" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
        });

        console.log("--------------------------------------------------");
        console.log("🔓 USER LOGIN");
        console.log(`👤 Name: ${user.fullname}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🕒 Time: ${new Date().toLocaleString()}`);
        console.log("--------------------------------------------------");

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            }
        });
    } catch (error) {
        console.error("❌ Login Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.token;
        await addToken(token);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("❌ Logout Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersModel();
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error("❌ Get All Users Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // only allow users to update their own profile
        if (!req.user || String(req.user.id) !== String(id)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updates = req.body || {};
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No updates provided" });
        }

        const updatedUser = await updateUserService(id, updates);
        res.status(200).json({ message: "User updated", user: updatedUser });
    } catch (error) {
        console.error("❌ Update User Error:", error.message);
        if (error.message === "Email already in use") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "User not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};
