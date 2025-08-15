import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../services/api';

// Кастомный селект компонент
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  name: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, placeholder, options, name }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field w-full text-left flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-bearplus-card-dark border-2 border-bearplus-green shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 text-left transition-colors border-b border-gray-600 last:border-b-0 ${
                value === option.value ? 'bg-bearplus-green text-black' : 'text-white hover:bg-bearplus-green hover:text-black'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      <input type="hidden" name={name} value={value} />
    </div>
  );
};

type UserType = 'client' | 'agent';
type Step = 'role' | 'form' | 'verification';

interface FormData {
  userType: UserType | null;
  firstName: string;
  lastName: string;
  organization: string;
  login: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
  // Agent specific fields
  organizationType: 'llc' | 'jsc' | 'individual' | 'foreign' | 'other' | '';
  activity: 'freight_forwarder' | 'customs_broker' | 'transport_company' | 'logistics' | 'other' | '';
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    userType: null,
    firstName: '',
    lastName: '',
    organization: '',
    login: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
    organizationType: '',
    activity: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleRoleSelect = (role: UserType) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (selectedRole) {
      setFormData(prev => ({ ...prev, userType: selectedRole }));
      setStep('form');
    }
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очистить ошибки при изменении полей
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    // Общие поля
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
      isValid = false;
    }

    if (!formData.login.trim()) {
      newErrors.login = 'Введите логин';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
      isValid = false;
    }

    // Для клиентов - пароли
    if (formData.userType === 'client') {
      if (!formData.password.trim()) {
        newErrors.password = 'Введите пароль';
        isValid = false;
      } else if (formData.password.length < 6) {
        newErrors.password = 'Пароль должен быть не менее 6 символов';
        isValid = false;
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Подтвердите пароль';
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
        isValid = false;
      }

      if (!formData.agree) {
        newErrors.agree = 'Необходимо согласие с условиями';
        isValid = false;
      }
    }

    // Для агентов
    if (formData.userType === 'agent') {
      if (!formData.organizationType.trim()) {
        newErrors.organizationType = 'Выберите тип организации';
        isValid = false;
      }

      if (!formData.activity.trim()) {
        newErrors.activity = 'Выберите тип деятельности';
        isValid = false;
      }

      if (!formData.agreeTerms || !formData.agreePrivacy) {
        newErrors.agreement = 'Необходимо согласие с условиями';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        setErrors({});
        
        const registerData: RegisterData = {
          userType: formData.userType!,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.login,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          companyName: formData.organization || undefined,
          organizationType: formData.organizationType || undefined,
          activityType: formData.activity || undefined,
          language: 'ru'
        };

        const response = await register(registerData);
        
        if (response.success) {
          // Переходим к этапу показа успешной регистрации
          setStep('verification');
        }
      } catch (error: any) {
        console.error('Registration failed:', error);
        
        // Обработка различных типов ошибок
        const errorMessage = error.message || 'Произошла ошибка при регистрации';
        
        if (errorMessage.includes('email already exists') || errorMessage.includes('email')) {
          setErrors(prev => ({ ...prev, email: 'Пользователь с таким email уже существует' }));
        } else if (errorMessage.includes('Username already taken') || errorMessage.includes('username')) {
          setErrors(prev => ({ ...prev, login: 'Данный логин уже занят' }));
        } else {
          setErrors(prev => ({ ...prev, general: 'Ошибка регистрации. Попробуйте снова.' }));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Этап 1: Выбор роли
  if (step === 'role') {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Регистрация</h1>
          <p className="text-gray-400 mb-12">Выберите, в роли кого вы хотите зарегистрироваться</p>
          
          <div className="grid grid-cols-2 gap-8 mb-12">
            <button
              onClick={() => handleRoleSelect('agent')}
              className={`p-8 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === 'agent'
                  ? 'border-bearplus-green bg-bearplus-green/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <h3 className="text-2xl font-semibold text-white mb-2">Агент</h3>
            </button>
            
            <button
              onClick={() => handleRoleSelect('client')}
              className={`p-8 rounded-xl border-2 transition-all duration-200 ${
                selectedRole === 'client'
                  ? 'border-bearplus-green bg-bearplus-green/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <h3 className="text-2xl font-semibold text-white mb-2">Клиент</h3>
            </button>
          </div>
          
          <button
            onClick={handleNext}
            disabled={!selectedRole}
            className="btn-green w-full max-w-md mx-auto py-3"
          >
            Далее
          </button>
        </div>
      </div>
    );
  }

  // Этап 2: Форма регистрации клиента (та что мы шлифовали)
  if (step === 'form' && formData.userType === 'client') {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-lg mx-auto">
          {/* Кнопка "Изменить роль" */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="text-bearplus-green hover:text-bearplus-green/80 transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Изменить роль</span>
            </button>
          </div>

          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Регистрация клиента</h1>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Имя и Фамилия */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                placeholder="Имя"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                placeholder="Фамилия"
                required
              />
            </div>

            {/* Наименование организации */}
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Наименование организации"
            />

            {/* Логин */}
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Логин"
              required
            />

            {/* E-mail и Телефон */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="E-mail"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="Телефон"
                required
              />
            </div>

            {/* Пароль и Подтверждение пароля */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field w-full pr-12"
                  placeholder="Пароль"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bearplus-green hover:text-bearplus-green/80"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field w-full pr-12"
                  placeholder="Подтверждение пароля"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bearplus-green hover:text-bearplus-green/80"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Текст о заполнении */}
            <div className="mt-6">
              <p className="text-gray-400 text-sm">
                *Все поля, кроме наименования компании, обязательны для заполнения
              </p>
            </div>

            {/* Чекбокс согласия */}
            <div className="mt-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="checkbox-custom mt-0.5 flex-shrink-0"
                  required
                />
                <span className="text-gray-300 text-sm">
                  Согласен(-на) с{' '}
                  <Link to="/privacy" className="text-bearplus-green hover:underline">
                    политикой конфиденциальности
                  </Link>
                  {' '}и{' '}
                  <Link to="/terms" className="text-bearplus-green hover:underline">
                    условиями использования сервиса
                  </Link>
                </span>
              </label>
            </div>

            {/* Ошибки */}
            {errors.general && (
              <div className="text-red-400 text-sm text-center mt-4">
                {errors.general}
              </div>
            )}

            {/* Кнопка регистрации */}
            <button
              type="submit"
              className="btn-green w-full mt-8 py-3"
              disabled={!formData.agree || isSubmitting}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Этап 2: Форма регистрации агента
  if (step === 'form' && formData.userType === 'agent') {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-lg mx-auto">
          {/* Кнопка "Изменить роль" */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="text-bearplus-green hover:text-bearplus-green/80 transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Изменить роль</span>
            </button>
          </div>

          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Регистрация агента</h1>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Имя и Фамилия */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input-field"
                placeholder="Имя"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                placeholder="Фамилия"
                required
              />
            </div>

            {/* Логин */}
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Логин"
              required
            />

            {/* E-mail и Телефон */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="E-mail"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="Телефон"
                required
              />
            </div>

            {/* Тип организации */}
            <CustomSelect
              name="organizationType"
              value={formData.organizationType}
              onChange={(value) => setFormData(prev => ({ ...prev, organizationType: value as 'llc' | 'jsc' | 'individual' | 'foreign' | 'other' }))}
              placeholder="Тип организации"
              options={[
                { value: 'medicine', label: 'Медицина' },
                { value: 'agriculture', label: 'Овощеводство' },
                { value: 'equipment', label: 'Продажа детских товаров' },
                { value: 'production', label: 'Производство сельхозтехники' },
                { value: 'repair', label: 'Ремонт цифровой техники' }
              ]}
            />

            {/* Тип деятельности */}
            <CustomSelect
              name="activity"
              value={formData.activity}
              onChange={(value) => setFormData(prev => ({ ...prev, activity: value as 'freight_forwarder' | 'customs_broker' | 'transport_company' | 'logistics' | 'other' }))}
              placeholder="Тип деятельности"
              options={[
                { value: 'production', label: 'Производство сельхозтехники' },
                { value: 'medicine', label: 'Медицина' },
                { value: 'agriculture', label: 'Овощеводство' },
                { value: 'equipment', label: 'Продажа детских товаров' },
                { value: 'repair', label: 'Ремонт цифровой техники' }
              ]}
            />

            {/* Текст о заполнении */}
            <div className="mt-6">
              <p className="text-gray-400 text-sm">
                *Все поля обязательны для заполнения
              </p>
            </div>

            {/* Чекбоксы согласия */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="checkbox-custom mt-0.5 flex-shrink-0"
                  required
                />
                <span className="text-gray-300 text-sm">
                  Согласен(-на) с{' '}
                  <Link to="/privacy" className="text-bearplus-green hover:underline">
                    политикой конфиденциальности
                  </Link>
                  {' '}и{' '}
                  <Link to="/terms" className="text-bearplus-green hover:underline">
                    условиями использования сервиса
                  </Link>
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleChange}
                  className="checkbox-custom mt-0.5 flex-shrink-0"
                  required
                />
                <span className="text-gray-300 text-sm">
                  Согласен с{' '}
                  <Link to="/privacy" className="text-bearplus-green hover:underline">
                    публичной офертой
                  </Link>
                </span>
              </label>
            </div>

            {/* Ошибки */}
            {errors.general && (
              <div className="text-red-400 text-sm text-center mt-4">
                {errors.general}
              </div>
            )}

            {/* Кнопка регистрации */}
            <button
              type="submit"
              className="btn-green w-full mt-8 py-3"
              disabled={!formData.agreeTerms || !formData.agreePrivacy || isSubmitting}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Этап 3: Успешная регистрация
  if (step === 'verification') {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="form-container animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-bearplus-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Регистрация завершена!</h1>
            <p className="text-gray-400">
              Мы отправили письмо с подтверждением на ваш email.
              <br />
              Проверьте почту и перейдите по ссылке для активации аккаунта.
            </p>
          </div>

          <div className="space-y-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-green w-full"
            >
              Перейти к входу
            </button>

            <div className="text-center">
              <span className="text-gray-400">Не получили письмо? </span>
              <button
                type="button"
                onClick={() => {
                  // TODO: Implement resend email
                  console.log('Resending email...');
                }}
                className="text-bearplus-green hover:text-bearplus-green/80 transition-colors font-medium"
              >
                Отправить повторно
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RegisterPage;