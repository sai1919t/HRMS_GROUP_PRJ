import express from "express";
import { signup, login, logout, getAllUsers, updateUser } from "../controllers/user.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middle.js";

const router = express.Router();

// ------------------- PUBLIC ROUTES -------------------
// Signup new user
router.post("/signup", signup);

// Login user
router.post("/login", login);

// ------------------- PROTECTED ROUTES -------------------
// Logout user (must be logged in)
router.post("/logout", authenticate, logout);

// Get all users (Admin only)
router.get("/", authenticate, authorizeRoles("Admin"), getAllUsers);

// Update user (user can update only their own profile)
router.put("/:id", authenticate, updateUser);

export default router;

