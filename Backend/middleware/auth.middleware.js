import jwt from "jsonwebtoken"; // auth
import { isTokenBlacklisted } from "../models/blacklistedTokens.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
            return res.status(401).json({ message: "Token is blacklisted. Please login again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
        req.token = token; // Attach token for logout
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ message: "Invalid or expired token." });
    }
};
