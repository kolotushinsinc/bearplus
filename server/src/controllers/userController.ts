import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { AuthRequest, IUser, PaginationQuery, UpdateProfileRequestBody, ChangePasswordRequestBody } from '../types';

// @desc    Получение профиля пользователя
// @route   GET /api/users/profile/:id
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        userType: user.userType,
        companyName: user.companyName,
        organizationType: user.organizationType,
        activityType: user.activityType,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        language: user.language,
        loyaltyDiscount: user.loyaltyDiscount,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Обновление профиля пользователя
// @route   PUT /api/users/profile/:id
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const updateData = req.body as UpdateProfileRequestBody;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        userType: user.userType,
        companyName: user.companyName,
        organizationType: user.organizationType,
        activityType: user.activityType,
        phone: user.phone,
        language: user.language,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Смена пароля
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { currentPassword, newPassword } = req.body as ChangePasswordRequestBody;
    const user = await User.findById(req.user!._id).select('+password');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Проверка текущего пароля
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
      return;
    }

    // Обновление пароля
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Деактивация аккаунта
// @route   PUT /api/users/deactivate
// @access  Private
export const deactivateAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Получение всех пользователей
// @route   GET /api/users
// @access  Private (только для агентов)
export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '10', search, userType } = req.query as PaginationQuery;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Построение фильтра
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    if (userType) {
      filter.userType = userType;
    }

    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalUsers / limitNum);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalUsers,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Обновление скидки лояльности
// @route   PUT /api/users/:id/loyalty
// @access  Private (только для агентов)
export const updateLoyaltyDiscount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { loyaltyDiscount } = req.body;

    if (loyaltyDiscount < 0 || loyaltyDiscount > 100) {
      res.status(400).json({
        success: false,
        message: 'Loyalty discount must be between 0 and 100',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { loyaltyDiscount },
      { new: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Loyalty discount updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        loyaltyDiscount: user.loyaltyDiscount,
      },
    });
  } catch (error) {
    next(error);
  }
};