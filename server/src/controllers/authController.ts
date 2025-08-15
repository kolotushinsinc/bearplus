import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { sendEmail, getVerificationEmailTemplate, getPasswordResetEmailTemplate } from '../utils/email';
import { 
  AuthRequest, 
  RegisterRequestBody, 
  LoginRequestBody, 
  ForgotPasswordRequestBody, 
  ResetPasswordRequestBody,
  IUser 
} from '../types';

// Генерация JWT токена
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  } as any);
};

// Отправка токена в ответе
const sendTokenResponse = (user: IUser, statusCode: number, res: Response): void => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || '7') * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      companyName: user.companyName,
      isEmailVerified: user.isEmailVerified,
      language: user.language,
    },
  });
};

// @desc    Регистрация пользователя
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const {
      userType,
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
      companyName,
      organizationType,
      activityType,
      language = 'ru',
    } = req.body as RegisterRequestBody;

    // Проверка существования пользователя
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'User with this email already exists'
          : 'Username already taken',
      });
      return;
    }

    // Создание пользователя
    const userData: any = {
      userType,
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
      language,
    };

    // Добавление полей для компании
    if (companyName) {
      userData.companyName = companyName;
    }

    // Добавление полей для агентов
    if (userType === 'agent') {
      if (organizationType) userData.organizationType = organizationType;
      if (activityType) userData.activityType = activityType;
    }

    const user = await User.create(userData);

    // Генерация токена для подтверждения email
    const emailToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(emailToken)
      .digest('hex');
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа

    await user.save({ validateBeforeSave: false });

    // Отправка email подтверждения
    try {
      const verifyUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/auth/verify-email/${emailToken}`;

      const emailTemplate = getVerificationEmailTemplate(verifyUrl, user.firstName, user.language);

      await sendEmail({
        email: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (err) {
      console.error('Email sending failed:', err);
      
      // Если email не отправился, все равно создаем пользователя
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Email verification will be sent shortly.',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          isEmailVerified: user.isEmailVerified,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Авторизация пользователя
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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

    const { email, password } = req.body as LoginRequestBody;

    // Проверка наличия пользователя
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Проверка блокировки аккаунта
    if (user.isLocked()) {
      res.status(401).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts',
      });
      return;
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      await user.incLoginAttempts();
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Проверка активности аккаунта
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
      return;
    }

    // Сброс попыток входа и обновление последнего входа
    await user.resetLoginAttempts();
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Получение текущего пользователя
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = req.user!;
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

// @desc    Выход пользователя
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req: AuthRequest, res: Response): void => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};

// @desc    Подтверждение email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Хеширование токена
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
      return;
    }

    // Активация пользователя
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Забыли пароль
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body as ForgotPasswordRequestBody;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Генерация токена сброса
    const resetToken = crypto.randomBytes(20).toString('hex');

    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    await user.save({ validateBeforeSave: false });

    // Отправка email
    try {
      const resetUrl = `${req.protocol}://${req.get(
        'host'
      )}/api/auth/reset-password/${resetToken}`;

      const emailTemplate = getPasswordResetEmailTemplate(resetUrl, user.firstName, user.language);

      await sendEmail({
        email: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });

      res.status(500).json({
        success: false,
        message: 'Email could not be sent',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Сброс пароля
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
      return;
    }

    const { password } = req.body as ResetPasswordRequestBody;

    // Установка нового пароля
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};