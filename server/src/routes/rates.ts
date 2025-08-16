import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth';
import {
  getRates,
  createRate,
  updateRate,
  deleteRate,
  uploadExcelRates,
  exportRates,
  downloadTemplate,
  ratesUploadMiddleware
} from '../controllers/ratesController';

const router = express.Router();

// @route   GET /api/rates
// @desc    Получение ставок агента
// @access  Private (только агенты)
router.get('/', authenticateToken, authorize('agent'), getRates);

// @route   POST /api/rates
// @desc    Создание новой ставки
// @access  Private (только агенты)
router.post('/', authenticateToken, authorize('agent'), createRate);

// @route   PUT /api/rates/:id
// @desc    Обновление ставки
// @access  Private (только агенты)
router.put('/:id', authenticateToken, authorize('agent'), updateRate);

// @route   DELETE /api/rates/:id
// @desc    Удаление ставки
// @access  Private (только агенты)
router.delete('/:id', authenticateToken, authorize('agent'), deleteRate);

// @route   POST /api/rates/upload
// @desc    Загрузка ставок из Excel файла
// @access  Private (только агенты)
router.post('/upload', authenticateToken, authorize('agent'), ratesUploadMiddleware, uploadExcelRates);

// @route   GET /api/rates/export
// @desc    Экспорт ставок в Excel
// @access  Private (только агенты)
router.get('/export', authenticateToken, authorize('agent'), exportRates);

// @route   GET /api/rates/template
// @desc    Скачивание шаблона Excel для загрузки ставок
// @access  Private (только агенты)
router.get('/template', authenticateToken, authorize('agent'), downloadTemplate);

export default router;