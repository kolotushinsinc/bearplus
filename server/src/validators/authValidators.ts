import { body, ValidationChain } from 'express-validator';

// Валидация регистрации
export const validateRegister: ValidationChain[] = [
  body('userType')
    .isIn(['client', 'agent', 'admin'])
    .withMessage('User type must be either client, agent, or admin'),

  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Zа-яА-Я\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Zа-яА-Я\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Password must be between 6 and 100 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  body('companyName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),

  body('organizationType')
    .optional()
    .isIn(['oao', 'zao', 'ooo', 'ip'])
    .withMessage('Invalid organization type'),

  body('activityType')
    .optional()
    .isIn(['logistics_company', 'agency'])
    .withMessage('Invalid activity type'),

  body('companyDescription')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Company description cannot exceed 1000 characters'),

  body('legalAddress')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Legal address cannot exceed 200 characters'),

  body('actualAddress')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Actual address cannot exceed 200 characters'),

  body('language')
    .optional()
    .isIn(['ru', 'en', 'zh'])
    .withMessage('Language must be ru, en, or zh'),

  // Кастомная валидация для агентов
  body('organizationType').custom((value, { req }) => {
    if (req.body.userType === 'agent' && !value) {
      throw new Error('Organization type is required for agents');
    }
    return true;
  }),

  body('activityType').custom((value, { req }) => {
    if (req.body.userType === 'agent' && !value) {
      throw new Error('Activity type is required for agents');
    }
    return true;
  }),

  body('companyName').custom((value, { req }) => {
    if (req.body.userType === 'agent' && !value) {
      throw new Error('Company name is required for agents');
    }
    return true;
  }),
];

// Валидация входа
export const validateLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Валидация забытого пароля
export const validateForgotPassword: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];

// Валидация сброса пароля
export const validateResetPassword: ValidationChain[] = [
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Password must be between 6 and 100 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// Валидация обновления профиля
export const validateUpdateProfile: ValidationChain[] = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Zа-яА-Я\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Zа-яА-Я\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('companyName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),

  body('language')
    .optional()
    .isIn(['ru', 'en', 'zh'])
    .withMessage('Language must be ru, en, or zh'),
];

// Валидация смены пароля
export const validateChangePassword: ValidationChain[] = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 6, max: 100 })
    .withMessage('New password must be between 6 and 100 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

// Валидация повторной отправки email верификации
export const validateResendVerification: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];