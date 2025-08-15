const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { authenticateToken } = require('../middleware/auth');

const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require('../validators/authValidators');

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
// @desc    Подтверждение email
// @access  Public
router.get('/verify-email/:token', verifyEmail);

// @route   POST /api/auth/forgot-password
// @desc    Запрос сброса пароля
// @access  Public
router.post('/forgot-password', validateForgotPassword, forgotPassword);

// @route   PUT /api/auth/reset-password/:token
// @desc    Сброс пароля
// @access  Public
router.put('/reset-password/:token', validateResetPassword, resetPassword);

module.exports = router;