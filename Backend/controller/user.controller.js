import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, findUserById, getAllUsers as getAllUsersModel } from "../models/user.model.js";
import { createUserService, updateUserService } from "../services/user.service.js";
import { addToken } from "../models/blacklistedTokens.js";
import pool from "../db/db.js";

export const signup = async (req, res) => {
    try {
        console.log("DATABASE_URL =", process.env.DATABASE_URL);
        const { fullname, email, password, designation, job_title, department, phone, date_of_joining, employee_id, profile_picture, status, role, gender } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newUser = await createUserService(
            fullname,
            email,
            password,
            designation,
            job_title,
            department,
            phone,
            date_of_joining,
            employee_id,
            profile_picture,
            status,
            role || 'Employee',
            gender || 'Not Specified'
        );

        console.log("--------------------------------------------------");
        console.log("🆕 NEW USER SIGNUP");
        console.log(`👤 Name: ${newUser.fullname}`);
        console.log(`📧 Email: ${newUser.email}`);
        console.log(`🏷️ Designation: ${newUser.designation}`);
        console.log(`🕒 Time: ${new Date().toLocaleString()}`);
        console.log("--------------------------------------------------");

        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser.id,
                employee_id: newUser.employee_id,
                fullname: newUser.fullname,
                email: newUser.email,
                designation: newUser.designation,
                job_title: newUser.job_title,
                department: newUser.department,
                phone: newUser.phone,
                date_of_joining: newUser.date_of_joining,
                status: newUser.status,
                role: newUser.role,
                profile_picture: newUser.profile_picture,
                gender: newUser.gender,
                created_at: newUser.created_at
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

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1h" }
        );

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
                email: user.email,
                role: user.role,
                profile_picture: user.profile_picture,
                gender: user.gender
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

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await findUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // remove sensitive fields
        const { password, ...rest } = user;
        res.status(200).json({ user: rest });
    } catch (error) {
        console.error("❌ Get User By ID Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // only allow users to update their own profile OR Admins
        const isSelf = req.user && String(req.user.id) === String(id);
        const isAdmin = req.user && req.user.role === 'Admin'; // Assuming req.user is populated with role

        // We might not have role in req.user yet depending on middleware. 
        // For now, stick to self update or allow if we implement admin check middleware later.
        if (!isSelf) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const updates = req.body || {};

        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            updates.profile_picture = `${protocol}://${host}/assets/uploads/${req.file.filename}`;
        }

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

// Admin: Add User
export const addUser = async (req, res) => {
    try {
        // Basic check for admin (middleware should handle this better but for safety)
        // const requester = await findUserById(req.userId); 
        // if (requester.role !== 'Admin') return res.status(403).json({ message: "Access denied" });

        const { fullname, email, password, designation, job_title, department, phone, date_of_joining, employee_id, profile_picture, status, role, gender } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newUser = await createUserService(
            fullname,
            email,
            password,
            designation,
            job_title,
            department,
            phone,
            date_of_joining,
            employee_id,
            profile_picture,
            status,
            role || 'Employee',
            gender || 'Not Specified'
        );

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });
    } catch (error) {
        console.error("❌ Add User Error:", error.message);
        if (error.message === "User already exists") {
            return res.status(400).json({ message: "User already exists" });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Admin: Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM users WHERE id = $1 RETURNING id";
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("❌ Delete User Error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
