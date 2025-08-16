import express from 'express';
import {
  getCurrencyRates,
  updateCurrencyRates,
  convertCurrency
} from '../controllers/currencyController';
import { authenticateToken, authorize } from '../middleware/auth';

const router = express.Router();

// Получить текущие курсы валют (доступно всем аутентифицированным пользователям)
router.get('/rates', authenticateToken, getCurrencyRates);

// Обновить курсы валют (только для администраторов)
router.post('/update', authenticateToken, authorize('ADMIN'), updateCurrencyRates);

// Конвертировать валюты (доступно всем аутентифицированным пользователям)
router.post('/convert', authenticateToken, convertCurrency);

export default router;