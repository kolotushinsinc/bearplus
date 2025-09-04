import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  company: string;
  position: string;
  userType: 'client' | 'agent';
  acceptTerms: boolean;
  acceptNewsletter: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState<'userType' | 'form'>('userType');
  const [formData, setFormData] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    position: '',
    userType: 'client',
    acceptTerms: false,
    acceptNewsletter: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно для заполнения';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна для заполнения';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать заглавные и строчные буквы, а также цифры';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Название компании обязательно для заполнения';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Необходимо согласиться с условиями использования';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // In production, this would be an API call
      console.log('Registering user:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful registration
      // In real app, dispatch register action
      // dispatch(register(formData));
      
      // Redirect to email verification
      navigate('/auth/verify-email', { 
        state: { email: formData.email }
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ email: 'Ошибка при регистрации. Попробуйте снова.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeSelect = (userType: 'client' | 'agent') => {
    setFormData(prev => ({ ...prev, userType }));
    setCurrentStep('form');
  };

  const handleBackToUserType = () => {
    setCurrentStep('userType');
  };

  // User Type Selection Step
  const renderUserTypeSelection = () => (
    <div className="min-h-screen bg-bearplus-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img
              className="h-12 w-auto"
              src="/logo.png"
              alt="BearPlus"
            />
          </Link>
          <h1 className="mt-6 text-4xl font-bold text-white">
            Регистрация
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Выберите, в роли кого вы хотите зарегистрироваться
          </p>
        </div>

        {/* User Type Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Agent Card */}
          <div
            onClick={() => handleUserTypeSelect('agent')}
            className={`relative cursor-pointer group transform transition-all duration-300 hover:scale-105 ${
              formData.userType === 'agent'
                ? 'ring-2 ring-bearplus-green'
                : 'hover:ring-2 hover:ring-gray-500'
            }`}
          >
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-750 transition-colors">
              <div className="text-6xl mb-4">👨‍💼</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">Агент</h3>
              <p className="text-gray-400 text-sm">
                Работаете в сфере логистики и хотите предоставлять услуги клиентам
              </p>
            </div>
          </div>

          {/* Client Card */}
          <div
            onClick={() => handleUserTypeSelect('client')}
            className={`relative cursor-pointer group transform transition-all duration-300 hover:scale-105 ${
              formData.userType === 'client'
                ? 'ring-2 ring-bearplus-green'
                : 'hover:ring-2 hover:ring-gray-500'
            }`}
          >
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-750 transition-colors">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-bearplus-green mb-2">Клиент</h3>
              <p className="text-gray-400 text-sm">
                Ищете логистические услуги для вашего бизнеса
              </p>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Уже есть аккаунт?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-bearplus-green hover:text-bearplus-green/80"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

  // Registration Form Step
  const renderRegistrationForm = () => (
    <div className="min-h-screen bg-bearplus-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img
              className="h-12 w-auto"
              src="/logo.png"
              alt="BearPlus"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Создать аккаунт
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Регистрация как{' '}
            <span className="text-bearplus-green font-medium">
              {formData.userType === 'client' ? 'Клиент' : 'Агент'}
            </span>
          </p>
          <button
            type="button"
            onClick={handleBackToUserType}
            className="mt-2 text-sm text-gray-400 hover:text-bearplus-green underline"
          >
            Изменить тип аккаунта
          </button>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  Имя
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="Имя"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="sr-only">
                  Фамилия
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Фамилия"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Email адрес"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-300">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">
                  Подтвердите пароль
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Подтвердите пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-300">
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </span>
                </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="sr-only">
                Телефон
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Телефон"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Company and Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="sr-only">
                  Компания
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`input-field ${errors.company ? 'border-red-500' : ''}`}
                  placeholder="Название компании"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-500">{errors.company}</p>
                )}
              </div>

              <div>
                <label htmlFor="position" className="sr-only">
                  Должность
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Должность"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className={`w-4 h-4 text-bearplus-green bg-gray-700 border-gray-600 rounded focus:ring-bearplus-green focus:ring-2 ${
                      errors.acceptTerms ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="text-gray-300">
                    Я согласен с{' '}
                    <Link to="/terms" className="text-bearplus-green hover:text-bearplus-green/80">
                      условиями использования
                    </Link>{' '}
                    и{' '}
                    <Link to="/privacy" className="text-bearplus-green hover:text-bearplus-green/80">
                      политикой конфиденциальности
                    </Link>
                  </label>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-500">{errors.acceptTerms}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptNewsletter"
                    name="acceptNewsletter"
                    type="checkbox"
                    checked={formData.acceptNewsletter}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-bearplus-green bg-gray-700 border-gray-600 rounded focus:ring-bearplus-green focus:ring-2"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptNewsletter" className="text-gray-300">
                    Подписаться на новости и специальные предложения
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-bearplus-green hover:bg-bearplus-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bearplus-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Создание аккаунта...
                </div>
              ) : (
                'Создать аккаунт'
              )}
            </button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-gray-400">
            <p>
              После регистрации на указанный email будет отправлено письмо для подтверждения аккаунта
            </p>
          </div>
        </form>
      </div>
    </div>
  );

  return currentStep === 'userType' ? renderUserTypeSelection() : renderRegistrationForm();
};

export default RegisterPage;