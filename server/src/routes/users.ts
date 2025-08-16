import express from 'express';
import { authenticateToken, authorize, checkOwnership } from '../middleware/auth';
import { validateUpdateProfile, validateChangePassword } from '../validators/authValidators';

// Import actual controller functions
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deactivateAccount,
  getAllUsers,
  updateLoyaltyDiscount,
} = require('../controllers/userController');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Получение собственного профиля пользователя
// @access  Private
router.get('/profile', authenticateToken, (req: any, res: any, next: any) => {
  req.params.id = req.user.id;
  getUserProfile(req, res, next);
});

// @route   PUT /api/users/profile
// @desc    Обновление собственного профиля пользователя
// @access  Private
router.put('/profile', authenticateToken, validateUpdateProfile, (req: any, res: any, next: any) => {
  req.params.id = req.user.id;
  updateUserProfile(req, res, next);
});

// @route   GET /api/users/profile/:id
// @desc    Получение профиля пользователя по ID
// @access  Private
router.get('/profile/:id', authenticateToken, checkOwnership, getUserProfile);

// @route   PUT /api/users/profile/:id
// @desc    Обновление профиля пользователя по ID
// @access  Private
router.put('/profile/:id', authenticateToken, checkOwnership, validateUpdateProfile, updateUserProfile);

// @route   PUT /api/users/change-password
// @desc    Смена пароля
// @access  Private
router.put('/change-password', authenticateToken, validateChangePassword, changePassword);

// @route   PUT /api/users/deactivate
// @desc    Деактивация аккаунта
// @access  Private
router.put('/deactivate', authenticateToken, deactivateAccount);

// @route   GET /api/users
// @desc    Получение всех пользователей (только для агентов)
// @access  Private (только агенты)
router.get('/', authenticateToken, authorize('agent'), getAllUsers);

// @route   PUT /api/users/:id/loyalty
// @desc    Обновление скидки лояльности (только для агентов)
// @access  Private (только агенты)
router.put('/:id/loyalty', authenticateToken, authorize('agent'), updateLoyaltyDiscount);

export default router;