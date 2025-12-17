import express from "express";
import { signup, login, logout, getAllUsers, updateUser } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// upload profile endpoint (multipart/form-data)
router.post("/upload-profile", upload.single("profile"), (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: "No file uploaded" });
		const filePath = `/assets/uploads/${req.file.filename}`;
		res.status(201).json({ path: filePath });
	} catch (err) {
		console.error("Upload error", err);
		res.status(500).json({ message: "Upload failed" });
	}
});
router.post("/logout", authMiddleware, logout);
router.get("/", authMiddleware, getAllUsers);
router.put("/:id", authMiddleware, upload.single('profile_picture'), updateUser);

export default router;
