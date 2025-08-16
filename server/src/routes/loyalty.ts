import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth';
import {
  getClients,
  getLoyaltyRules,
  updateClientDiscount,
  updateLoyaltyRule,
  calculateSuggestedDiscount,
  getDiscountHistory
} from '../controllers/loyaltyController';

const router = express.Router();

// @route   GET /api/loyalty/clients
// @desc    Получение списка клиентов
// @access  Private (только агенты)
router.get('/clients', authenticateToken, authorize('agent'), getClients);

// @route   GET /api/loyalty/rules
// @desc    Получение правил лояльности агента
// @access  Private (только агенты)
router.get('/rules', authenticateToken, authorize('agent'), getLoyaltyRules);

// @route   PUT /api/loyalty/clients/:clientId/discount
// @desc    Обновление скидки клиента
// @access  Private (только агенты)
router.put('/clients/:clientId/discount', authenticateToken, authorize('agent'), updateClientDiscount);

// @route   PUT /api/loyalty/rules/:id
// @desc    Обновление правила лояльности
// @access  Private (только агенты)
router.put('/rules/:id', authenticateToken, authorize('agent'), updateLoyaltyRule);

// @route   GET /api/loyalty/clients/:clientId/suggested-discount
// @desc    Расчет рекомендуемой скидки для клиента
// @access  Private (только агенты)
router.get('/clients/:clientId/suggested-discount', authenticateToken, authorize('agent'), calculateSuggestedDiscount);

// @route   GET /api/loyalty/history
// @desc    История изменения скидок
// @access  Private (только агенты)
router.get('/history', authenticateToken, authorize('agent'), getDiscountHistory);

export default router;