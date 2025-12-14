import express from "express";
import {
  scheduleInterview,
  getInterviews
} from "../controller/interview.controller.js";

const router = express.Router();

// Interview routes
router.post("/", scheduleInterview);
router.get("/", getInterviews);

export default router;
