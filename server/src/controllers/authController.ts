import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { sendEmail, getVerificationEmailTemplate, generatePasswordResetCodeEmail, generateEmailVerificationCodeTemplate } from '../utils/email';
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
      // Дополнительные поля из body (если есть)
      if (req.body.companyDescription) userData.companyDescription = req.body.companyDescription;
      if (req.body.legalAddress) userData.legalAddress = req.body.legalAddress;
      if (req.body.actualAddress) userData.actualAddress = req.body.actualAddress;
    }

    const user = await User.create(userData);

    // Генерация 4-значного кода для подтверждения email
    const emailVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(emailVerificationCode)
      .digest('hex');
    user.emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 минут

    await user.save({ validateBeforeSave: false });

    // Отправка email подтверждения с кодом
    try {
      const emailTemplate = generateEmailVerificationCodeTemplate(emailVerificationCode, user.firstName, user.language);

      await sendEmail({
        email: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      res.status(201).json({
        success: true,
        message: 'Пользователь зарегистрирован. Проверьте email для получения кода подтверждения.',
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
        message: 'Пользователь зарегистрирован. Код подтверждения будет отправлен на email.',
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
        companyDescription: user.companyDescription,
        legalAddress: user.legalAddress,
        actualAddress: user.actualAddress,
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
  // Полная очистка cookie
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};

// @desc    Подтверждение email с 4-значным кодом
// @route   POST /api/auth/verify-email-code
// @access  Public
export const verifyEmailCode = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({
        success: false,
        message: 'Email и код обязательны',
      });
      return;
    }

    // Хеширование кода
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    const user = await User.findOne({
      email,
      emailVerificationToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Неверный или истекший код подтверждения',
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
      message: 'Email подтвержден успешно',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Подтверждение email (старый метод для обратной совместимости)
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

// @desc    Забыли пароль - отправка 4-значного кода
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

    // Генерация 4-значного кода
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 минут

    await user.save({ validateBeforeSave: false });

    // Отправка email с кодом
    try {
      console.log('🔧 DEBUG: Генерируем НОВЫЙ шаблон с кодом:', resetCode);
      const emailTemplate = generatePasswordResetCodeEmail(resetCode, user.firstName, user.language);
      
      console.log('🔧 DEBUG: Используется функция generatePasswordResetCodeEmail');
      
      console.log('📧 DEBUG: Subject:', emailTemplate.subject);
      console.log('📧 DEBUG: HTML содержит код?', emailTemplate.html.includes(resetCode));
      
      // Показываем первые 200 символов HTML для отладки
      console.log('📧 DEBUG: HTML preview:', emailTemplate.html.substring(0, 200) + '...');

      await sendEmail({
        email: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset code sent to your email',
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

// @desc    Проверка 4-значного кода
// @route   POST /api/auth/verify-reset-code
// @access  Public
export const verifyResetCode = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, code } = req.body;

    console.log('🔧 DEBUG verifyResetCode: email =', email, 'code =', code);

    if (!email || !code) {
      res.status(400).json({
        success: false,
        message: 'Email and code are required',
      });
      return;
    }

    const passwordResetToken = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    console.log('🔧 DEBUG: passwordResetToken =', passwordResetToken);
    console.log('🔧 DEBUG: Текущее время =', new Date());

    // Сначала найдем пользователя по email
    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      console.log('🔧 DEBUG: Найден пользователь с email, токен в БД =', userByEmail.passwordResetToken);
      console.log('🔧 DEBUG: Истекает =', userByEmail.passwordResetExpires);
      console.log('🔧 DEBUG: Токены совпадают?', userByEmail.passwordResetToken === passwordResetToken);
      console.log('🔧 DEBUG: Код не истек?', userByEmail.passwordResetExpires && userByEmail.passwordResetExpires > new Date());
    }

    const user = await User.findOne({
      email,
      passwordResetToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log('❌ DEBUG: Пользователь с валидным кодом не найден');
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code',
      });
      return;
    }

    console.log('✅ DEBUG: Код верифицирован успешно');

    res.status(200).json({
      success: true,
      message: 'Reset code verified successfully',
      data: { email, codeVerified: true }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Сброс пароля с 4-значным кодом
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, code, password, confirmPassword } = req.body;

    if (!email || !code || !password || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
      return;
    }

    const passwordResetToken = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    console.log('🔧 DEBUG resetPassword: email =', email, 'code =', code);
    console.log('🔧 DEBUG: passwordResetToken =', passwordResetToken);

    const user = await User.findOne({
      email,
      passwordResetToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      console.log('❌ DEBUG resetPassword: Пользователь с валидным кодом не найден');
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code',
      });
      return;
    }

    console.log('✅ DEBUG resetPassword: Пользователь найден, меняем пароль');

    // Установка нового пароля
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // Автологин после смены пароля
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Повторная отправка письма верификации
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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

    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
      return;
    }

    // Генерация нового 4-значного кода для подтверждения email
    const emailVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(emailVerificationCode)
      .digest('hex');
    user.emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 минут

    await user.save({ validateBeforeSave: false });

    // Отправка email подтверждения с кодом
    try {
      const emailTemplate = generateEmailVerificationCodeTemplate(emailVerificationCode, user.firstName, user.language);

      await sendEmail({
        email: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      res.status(200).json({
        success: true,
        message: 'Код подтверждения отправлен на email',
      });
    } catch (err) {
      console.error('Email sending failed:', err);
      
      res.status(500).json({
        success: false,
        message: 'Could not send verification email',
      });
    }
  } catch (error) {
    next(error);
  }
};