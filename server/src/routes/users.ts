import express from 'express';
import { authenticateToken, authorize, checkOwnership } from '../middleware/auth';
import { validateUpdateProfile, validateChangePassword } from '../validators/authValidators';

const router = express.Router();

// Заглушки для контроллеров пользователей (будут созданы позже)
const getUserProfile = (req: any, res: any) => {
  res.json({ message: 'Get user profile - TO BE IMPLEMENTED' });
};

const updateUserProfile = (req: any, res: any) => {
  res.json({ message: 'Update user profile - TO BE IMPLEMENTED' });
};

const changePassword = (req: any, res: any) => {
  res.json({ message: 'Change password - TO BE IMPLEMENTED' });
};

const deactivateAccount = (req: any, res: any) => {
  res.json({ message: 'Deactivate account - TO BE IMPLEMENTED' });
};

const getAllUsers = (req: any, res: any) => {
  res.json({ message: 'Get all users - TO BE IMPLEMENTED' });
};

const updateLoyaltyDiscount = (req: any, res: any) => {
  res.json({ message: 'Update loyalty discount - TO BE IMPLEMENTED' });
};

// @route   GET /api/users/profile/:id
// @desc    Получение профиля пользователя
// @access  Private
router.get('/profile/:id', authenticateToken, checkOwnership, getUserProfile);

// @route   PUT /api/users/profile/:id
// @desc    Обновление профиля пользователя
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