import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  confirmOrderStage,
  updateOrderStatus,
  deleteOrder
} from '../controllers/ordersController';

import { authenticateToken, authorize } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/orders
// @desc    Получение списка заявок пользователя
// @access  Private
router.get('/', authenticateToken, getOrders);

// @route   POST /api/orders
// @desc    Создание новой заявки
// @access  Private
router.post('/', authenticateToken, createOrder);

// @route   GET /api/orders/:orderId
// @desc    Получение заявки по ID
// @access  Private
router.get('/:orderId', authenticateToken, getOrderById);

// @route   PUT /api/orders/:orderId/status
// @desc    Обновление статуса заявки (только для агентов)
// @access  Private (agents only)
router.put('/:orderId/status', authenticateToken, authorize('agent'), updateOrderStatus);

// @route   POST /api/orders/:orderId/stages/:stageId/confirm
// @desc    Подтверждение этапа заявки клиентом
// @access  Private
router.post('/:orderId/stages/:stageId/confirm', authenticateToken, confirmOrderStage);

// @route   DELETE /api/orders/:orderId
// @desc    Удаление заявки
// @access  Private
router.delete('/:orderId', authenticateToken, deleteOrder);

export default router;