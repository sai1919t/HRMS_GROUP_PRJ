import express from "express";
import { signup, login, logout, getAllUsers, updateUser } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/", authMiddleware, getAllUsers);
router.put("/:id", authMiddleware, updateUser);

export default router;
