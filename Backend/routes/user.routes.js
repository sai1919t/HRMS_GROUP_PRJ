import express from "express";
import { signup, login, logout, getAllUsers } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/", authMiddleware, getAllUsers);

export default router;
