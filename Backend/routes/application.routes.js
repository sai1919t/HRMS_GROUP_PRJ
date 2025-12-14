import express from "express";
import { applyJob, getApplications, updateStatus } from "../controller/application.controller.js";

const router = express.Router();

// Job application routes
router.post("/jobs/:id/apply", applyJob);
router.get("/applications", getApplications);
router.patch("/applications/:id/status", updateStatus);

export default router;
