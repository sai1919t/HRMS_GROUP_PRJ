import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../models/blacklistedTokens.js";
import { findUserById } from "../models/user.model.js";

/**
 * AUTHENTICATE - Verify JWT token and attach user to request
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.replace("Bearer ", "");

        // Check if token is blacklisted
        const blacklisted = await isTokenBlacklisted(token);
        if (blacklisted) return res.status(401).json({ message: "Token is blacklisted. Please login again." });

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

        // Fetch user from database
        const user = await findUserById(decoded.id);
        if (!user) return res.status(401).json({ message: "User not found" });

        // Attach user and token to request object
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

/**
 * AUTHORIZE ROLES - Protect routes based on roles (Admin / Employee)
 * Usage: authorizeRoles("Admin"), authorizeRoles("Employee", "Admin")
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.designation)) {
            return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
        }
        next();
    };
};

