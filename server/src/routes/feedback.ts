import express from 'express';
import {
  submitFeedback,
  getFeedbackList,
  updateFeedbackStatus,
  respondToFeedback
} from '../controllers/feedbackController';

import { authenticateToken, authorize } from '../middleware/auth';

const router = express.Router();

// @route   POST /api/feedback
// @desc    Отправка обратной связи
// @access  Public
router.post('/', submitFeedback);

// @route   GET /api/feedback
// @desc    Получение списка обращений (только для агентов)
// @access  Private (agents only)
router.get('/', authenticateToken, authorize('agent'), getFeedbackList);

// @route   PUT /api/feedback/:feedbackId/status
// @desc    Обновление статуса обращения (только для агентов)
// @access  Private (agents only)
router.put('/:feedbackId/status', authenticateToken, authorize('agent'), updateFeedbackStatus);

// @route   POST /api/feedback/:feedbackId/respond
// @desc    Ответ на обращение (только для агентов)
// @access  Private (agents only)
router.post('/:feedbackId/respond', authenticateToken, authorize('agent'), respondToFeedback);

export default router;