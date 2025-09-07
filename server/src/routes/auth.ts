import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  logout,
  verifyEmail,
  verifyEmailCode,
  resendVerificationEmail,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from '../controllers/authController';

import { authenticateToken } from '../middleware/auth';

import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateResendVerification,
} from '../validators/authValidators';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Регистрация нового пользователя
// @access  Public
router.post('/register', validateRegister, register);

// @route   POST /api/auth/login
// @desc    Авторизация пользователя
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/me
// @desc    Получение текущего пользователя
// @access  Private
router.get('/me', authenticateToken, getMe);

// @route   POST /api/auth/logout
// @desc    Выход пользователя
// @access  Private
router.post('/logout', authenticateToken, logout);

// @route   GET /api/auth/verify-email/:token
// @desc    Подтверждение email (старый метод)
// @access  Public
router.get('/verify-email/:token', verifyEmail);

// @route   POST /api/auth/verify-email-code
// @desc    Подтверждение email 4-значным кодом
// @access  Public
router.post('/verify-email-code', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('code').isLength({ min: 4, max: 4 }).withMessage('Code must be exactly 4 digits'),
], verifyEmailCode);

// @route   POST /api/auth/resend-verification
// @desc    Повторная отправка письма верификации
// @access  Public
router.post('/resend-verification', validateResendVerification, resendVerificationEmail);

// @route   POST /api/auth/forgot-password
// @desc    Запрос сброса пароля
// @access  Public
router.post('/forgot-password', validateForgotPassword, forgotPassword);

// @route   POST /api/auth/verify-reset-code
// @desc    Проверка 4-значного кода восстановления
// @access  Public
router.post('/verify-reset-code', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('code').isLength({ min: 4, max: 4 }).withMessage('Code must be exactly 4 digits'),
], verifyResetCode);

// @route   POST /api/auth/reset-password
// @desc    Сброс пароля с кодом
// @access  Public
router.post('/reset-password', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('code').isLength({ min: 4, max: 4 }).withMessage('Code must be exactly 4 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value: any, { req }: any) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
], resetPassword);

export default router;