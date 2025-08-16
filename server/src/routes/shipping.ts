import express from 'express';
import {
  calculateShippingRate,
  submitDangerousCargoRequest,
  getSystemSettings,
  updateSystemSettings
} from '../controllers/shippingController';

import { authenticateToken, authorize } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/shipping/calculate
// @desc    Расчет стоимости доставки
// @access  Public
router.post('/calculate', calculateShippingRate);

// @route   POST /api/shipping/dangerous-cargo
// @desc    Подача заявки на перевозку опасного груза
// @access  Private
router.post('/dangerous-cargo', authenticateToken, submitDangerousCargoRequest);

// @route   GET /api/shipping/settings
// @desc    Получение системных настроек (только для агентов)
// @access  Private (agents only)
router.get('/settings', authenticateToken, authorize('agent'), getSystemSettings);

// @route   PUT /api/shipping/settings
// @desc    Обновление системных настроек (только для агентов)
// @access  Private (agents only)
router.put('/settings', authenticateToken, authorize('agent'), updateSystemSettings);

export default router;