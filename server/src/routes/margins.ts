import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth';
import {
  getMarginSettings,
  updateMarginSetting,
  updateCurrencyRates,
  calculateMargin
} from '../controllers/marginController';

const router = express.Router();

// @route   GET /api/margins
// @desc    Получение настроек маржи агента
// @access  Private (только агенты)
router.get('/', authenticateToken, authorize('agent'), getMarginSettings);

// @route   PUT /api/margins/:id
// @desc    Обновление настройки маржи
// @access  Private (только агенты)
router.put('/:id', authenticateToken, authorize('agent'), updateMarginSetting);

// @route   POST /api/margins/currency/update
// @desc    Обновление курсов валют
// @access  Private (только агенты)
router.post('/currency/update', authenticateToken, authorize('agent'), updateCurrencyRates);

// @route   POST /api/margins/calculate
// @desc    Расчет маржи для суммы
// @access  Private (только агенты)
router.post('/calculate', authenticateToken, authorize('agent'), calculateMargin);

export default router;