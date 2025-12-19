import express from 'express';
import * as PromotionController from '../controller/promotion.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', PromotionController.listPromotions);
router.get('/:id', PromotionController.getPromotion);
router.post('/', authMiddleware, PromotionController.createPromotion); // admin only enforced in controller
router.post('/:id/apply', authMiddleware, PromotionController.applyPromotion);
router.get('/:id/applications', authMiddleware, PromotionController.listApplications); // admin only
router.get('/me/applications', authMiddleware, PromotionController.userApplications);

export default router;