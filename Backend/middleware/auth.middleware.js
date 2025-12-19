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
        if (error && error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(401).json({ message: "Invalid or expired token." });
    }
};

// Optional auth: parse token if present, but don't reject requests without token
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return next();

    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      console.warn('optionalAuth: token blacklisted');
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded;
      req.token = token;
    } catch (err) {
      console.warn('optionalAuth: token invalid', err.message);
      // ignore invalid token, don't block request
    }
    return next();
  } catch (err) {
    console.error('optionalAuth error', err);
    return next();
  }
};
