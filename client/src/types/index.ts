// Типы пользователя
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  userType: 'client' | 'agent' | 'admin';
  companyName?: string;
  organizationType?: 'oao' | 'zao' | 'ooo' | 'ip';
  activityType?: 'logistics_company' | 'agency';
  companyDescription?: string;
  legalAddress?: string;
  actualAddress?: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  language: 'ru' | 'en' | 'zh';
  loyaltyDiscount: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

// Типы для форм аутентификации
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
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

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Типы для API ответов
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
  token?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field?: string;
  msg: string;
  value?: any;
  location?: string;
  param?: string;
}

// Типы для состояния Redux
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
}

// Типы для роутинга
export interface ProtectedRouteProps {
  children: any;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
  allowedUserTypes?: ('client' | 'agent' | 'admin')[];
}

// Типы для компонентов форм
export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validation?: any;
  options?: SelectOption[];
}

export interface SelectOption {
  value: string;
  label: string;
}

// Типы для мультиязычности
export interface LanguageOption {
  code: 'ru' | 'en' | 'zh';
  name: string;
  flag: string;
}

// Типы для уведомлений
export interface NotificationState {
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

// Типы для калькулятора доставки
export interface ShippingCalculatorData {
  departure: string;
  arrival: string;
  containerType: string;
  cargoType: 'dangerous' | 'normal' | 'mixed';
  cargoCharacteristics?: {
    isDangerous: boolean;
    isOversized: boolean;
    weight: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  };
  desiredDates: {
    departure?: string;
    arrival?: string;
  };
  msdsDocuments?: File[];
}

export interface ShippingRate {
  id: string;
  type: 'freight' | 'auto' | 'railway';
  route: {
    departure: string;
    arrival: string;
    transitTime: number;
  };
  pricing: {
    baseCost: number;
    currency: 'USD' | 'EUR' | 'RUB';
    margin: number;
    totalCost: number;
  };
  containerInfo: {
    type: string;
    size: string;
    availability: boolean;
  };
  isDirect: boolean;
  provider: string;
  validUntil: string;
}

// Типы для управления документами
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'image';
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  category: 'contract' | 'invoice' | 'certificate' | 'msds' | 'other';
}

// Типы для заявок
export interface ShippingRequest {
  id: string;
  status: 'pending' | 'processing' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  type: 'freight' | 'auto' | 'railway' | 'combined';
  client: {
    id: string;
    name: string;
    company: string;
  };
  route: {
    departure: string;
    arrival: string;
    estimatedDeparture: string;
    estimatedArrival: string;
  };
  cargo: {
    description: string;
    weight: number;
    isDangerous: boolean;
    documents: Document[];
  };
  pricing: {
    baseCost: number;
    additionalCosts: number;
    discount: number;
    totalCost: number;
    currency: string;
  };
  tracking?: {
    currentLocation: string;
    lastUpdate: string;
    vessel?: {
      name: string;
      imo: string;
      trackingUrl: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Типы для мессенджера
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  isRead: boolean;
  requestId?: string;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  requestId?: string;
  createdAt: string;
  updatedAt: string;
}

// Типы для настроек
export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    allowMarketing: boolean;
  };
  preferences: {
    language: 'ru' | 'en' | 'zh';
    currency: 'USD' | 'EUR' | 'RUB';
    timezone: string;
    dateFormat: string;
  };
}

// Типы для аналитики (для агентов)
export interface Analytics {
  period: 'day' | 'week' | 'month' | 'year';
  requests: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    currency: string;
    growth: number;
  };
  clients: {
    total: number;
    new: number;
    active: number;
  };
  topRoutes: Array<{
    route: string;
    count: number;
    revenue: number;
  }>;
}