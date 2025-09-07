import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
  // Основная информация
  userType: {
    type: String,
    enum: ['client', 'agent', 'admin'],
    required: [true, 'User type is required']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please provide a valid phone number'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // По умолчанию не включать пароль в запросы
  },

  // Информация о компании (для агентов и клиентов)
  companyName: {
    type: String,
    required: function(this: IUser) {
      return this.userType === 'agent' || this.userType === 'client';
    },
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  
  // Дополнительная информация для агентов
  organizationType: {
    type: String,
    enum: ['oao', 'zao', 'ooo', 'ip'], // ОАО, ЗАО, ООО, ИП
    required: function(this: IUser) {
      return this.userType === 'agent';
    }
  },
  activityType: {
    type: String,
    enum: ['logistics_company', 'agency'], // Логистическая Компания, Агентирование
    required: function(this: IUser) {
      return this.userType === 'agent';
    }
  },
  
  // Дополнительные поля для профиля
  companyDescription: {
    type: String,
    maxlength: [1000, 'Company description cannot exceed 1000 characters']
  },
  legalAddress: {
    type: String,
    maxlength: [200, 'Legal address cannot exceed 200 characters']
  },
  actualAddress: {
    type: String,
    maxlength: [200, 'Actual address cannot exceed 200 characters']
  },
  
  // Статус аккаунта
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Токены для подтверждения
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Настройки
  language: {
    type: String,
    enum: ['ru', 'en', 'zh'],
    default: 'ru'
  },
  
  // Настройки лояльности (скидки)
  loyaltyDiscount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Метаданные
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Виртуальное поле для полного имени
userSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// Индексы
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ isActive: 1 });

// Хеширование пароля перед сохранением
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Метод для проверки блокировки аккаунта
userSchema.methods.isLocked = function(this: IUser): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Метод для увеличения счетчика неудачных попыток входа
userSchema.methods.incLoginAttempts = function(this: IUser) {
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates: any = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) }; // 2 часа
  }
  
  return this.updateOne(updates);
};

// Метод для сброса счетчика попыток
userSchema.methods.resetLoginAttempts = function(this: IUser) {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;