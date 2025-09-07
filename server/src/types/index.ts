import { Request } from 'express';
import { Document } from 'mongoose';

// Интерфейс пользователя
export interface IUser extends Document {
  _id: string;
  userType: 'client' | 'agent' | 'admin';
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  companyName?: string;
  organizationType?: 'oao' | 'zao' | 'ooo' | 'ip';
  activityType?: 'logistics_company' | 'agency';
  companyDescription?: string;
  legalAddress?: string;
  actualAddress?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  language: 'ru' | 'en' | 'zh';
  loyaltyDiscount: number;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;

  // Методы
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incLoginAttempts(): Promise<any>;
  resetLoginAttempts(): Promise<any>;
}

// Расширенный Request с пользователем
export interface AuthRequest extends Request {
  user?: IUser;
}

// Типы для регистрации
export interface RegisterRequestBody {
  userType: 'client' | 'agent' | 'admin';
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  companyName?: string;
  organizationType?: 'oao' | 'zao' | 'ooo' | 'ip';
  activityType?: 'logistics_company' | 'agency';
  companyDescription?: string;
  legalAddress?: string;
  actualAddress?: string;
  language?: 'ru' | 'en' | 'zh';
}

// Типы для входа
export interface LoginRequestBody {
  email: string;
  password: string;
}

// Типы для сброса пароля
export interface ForgotPasswordRequestBody {
  email: string;
}

export interface ResetPasswordRequestBody {
  password: string;
  confirmPassword: string;
}

// Типы для обновления профиля
export interface UpdateProfileRequestBody {
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  organizationType?: 'oao' | 'zao' | 'ooo' | 'ip';
  activityType?: 'logistics_company' | 'agency';
  companyDescription?: string;
  legalAddress?: string;
  actualAddress?: string;
  language?: 'ru' | 'en' | 'zh';
}

// Типы для смены пароля
export interface ChangePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Ответ API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: Partial<IUser>;
  token?: string;
  errors?: any[];
}

// Типы для пагинации
export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  userType?: 'client' | 'agent' | 'admin';
}

export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Типы для email
export interface EmailOptions {
  email: string;
  subject: string;
  message?: string;
  html?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
}

// Типы для JWT
export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// Конфигурация окружения
export interface EnvironmentConfig {
  PORT: string;
  NODE_ENV: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  RABBITMQ_URL: string;
  CLIENT_URL: string;
  CRM_URL: string;
  CURRENCY_API_KEY: string;
  MAX_FILE_SIZE: string;
  UPLOAD_PATH: string;
  RATE_LIMIT_WINDOW: string;
  RATE_LIMIT_MAX: string;
}

// Типы ошибок
export interface CustomError extends Error {
  statusCode?: number;
  code?: number | string;
  keyPattern?: any;
  errors?: any;
  type?: string;
}

// Типы для валидации
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}