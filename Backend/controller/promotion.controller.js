import * as PromotionModel from '../models/promotion.model.js';

export const createPromotion = async (req, res) => {
  try {
    // Only admins may create promotions
    if (!req.user || req.user.role !== 'Admin') return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });

    const { employee_id, new_role, new_salary, reason } = req.body;
    if (!employee_id || !new_role) return res.status(400).json({ success: false, message: 'employee_id and new_role are required' });

    const promotion = await PromotionModel.createPromotion(employee_id, req.user.id, new_role, new_salary || '', reason || '');
    return res.status(201).json({ success: true, data: promotion });
  } catch (err) {
    console.error('createPromotion error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const listPromotions = async (req, res) => {
  try {
    const promotions = await PromotionModel.getPromotions();
    return res.json({ success: true, promotions });
  } catch (err) {
    console.error('listPromotions error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await PromotionModel.getPromotionById(id);
    if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });
    return res.json({ success: true, data: promotion });
  } catch (err) {
    console.error('getPromotion error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const applyPromotion = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { id } = req.params; // promotion id
    const { cover_letter } = req.body;

    const app = await PromotionModel.createPromotionApplication(req.user.id, id, cover_letter || '');
    return res.status(201).json({ success: true, data: app });
  } catch (err) {
    console.error('applyPromotion error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const listApplications = async (req, res) => {
  try {
    // Admin-only
    if (!req.user || req.user.role !== 'Admin') return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });

    const { id } = req.params; // promotion id
    const apps = await PromotionModel.getApplicationsByPromotion(id);
    return res.json({ success: true, applications: apps });
  } catch (err) {
    console.error('listApplications error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const userApplications = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const apps = await PromotionModel.getUserApplications(req.user.id);
    return res.json({ success: true, applications: apps });
  } catch (err) {
    console.error('userApplications error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};