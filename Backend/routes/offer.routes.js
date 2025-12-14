import express from "express";
import {
  createOffer,
  getOffers,
  updateOfferStatus,
  downloadOfferLetter
} from "../controller/offer.controller.js";

const router = express.Router();

// Offer routes
router.post("/", createOffer);
router.get("/", getOffers);
router.patch("/:id/status", updateOfferStatus);
router.get("/:id/download", downloadOfferLetter);

export default router;
