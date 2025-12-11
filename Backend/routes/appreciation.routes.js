import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    createAppreciationController,
    getAllAppreciationsController,
    getAppreciationByIdController,
    deleteAppreciationController,
    toggleLikeController,
    addCommentController,
    deleteCommentController,
    getCommentsController
} from "../controller/appreciation.controller.js";

const router = express.Router();

// Appreciation routes
router.post("/", authMiddleware, createAppreciationController);
router.get("/", getAllAppreciationsController);
router.get("/:id", getAppreciationByIdController);
router.delete("/:id", authMiddleware, deleteAppreciationController);

// Like routes
router.post("/:id/like", authMiddleware, toggleLikeController);

// Comment routes
router.post("/:id/comments", authMiddleware, addCommentController);
router.get("/:id/comments", getCommentsController);
router.delete("/:id/comments/:commentId", authMiddleware, deleteCommentController);

export default router;
