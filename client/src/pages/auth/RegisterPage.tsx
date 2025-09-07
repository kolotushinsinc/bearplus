
import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { registerUser, forceLogout } from '../../store/slices/authSlice';
import authService from '../../services/authService';

interface AgentRegisterForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  organizationType: 'oao' | 'zao' | 'ooo' | 'ip' | '';
  activityType: 'logistics_company' | 'agency' | '';
  companyName: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptOffer: boolean;
}

interface ClientRegisterForm {
  firstName: string;
  lastName: string;
  companyName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const RegisterPage: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState<'userType' | 'agentForm' | 'clientForm'>('userType');
  const [userType, setUserType] = useState<'client' | 'agent' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Принудительная полная очистка при входе на страницу регистрации
  React.useEffect(() => {
    // Используем forceLogout для агрессивной очистки всех данных
    dispatch(forceLogout());
    
    // Дополнительно очищаем cookies через API logout
    authService.logout().catch(() => {
      // Игнорируем ошибки logout
    });
  }, [dispatch]);

  const [agentForm, setAgentForm] = useState<AgentRegisterForm>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    organizationType: '',
    activityType: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptOffer: false
  });

  const [clientForm, setClientForm] = useState<ClientRegisterForm>({
    firstName: '',
    lastName: '',
    companyName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAgentForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!agentForm.firstName.trim()) newErrors.firstName = 'Имя обязательно для заполнения';
    if (!agentForm.lastName.trim()) newErrors.lastName = 'Фамилия обязательна для заполнения';
    if (!agentForm.username.trim()) newErrors.username = 'Логин обязателен для заполнения';
    if (!agentForm.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agentForm.email)) {
      newErrors.email = 'Неверный формат email';
    }
    if (!agentForm.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(agentForm.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }
    if (!agentForm.organizationType) newErrors.organizationType = 'Выберите тип организации';
    if (!agentForm.activityType) newErrors.activityType = 'Выберите тип деятельности';
    if (!agentForm.companyName.trim()) newErrors.companyName = 'Название компании обязательно';
    if (!agentForm.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (agentForm.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    if (agentForm.password !== agentForm.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    if (!agentForm.acceptTerms) newErrors.acceptTerms = 'Необходимо принять условия использования';
    if (!agentForm.acceptOffer) newErrors.acceptOffer = 'Необходимо согласиться с условиями оферты';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateClientForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clientForm.firstName.trim()) newErrors.firstName = 'Имя обязательно для заполнения';
    if (!clientForm.lastName.trim()) newErrors.lastName = 'Фамилия обязательна для заполнения';
    if (!clientForm.username.trim()) newErrors.username = 'Логин обязателен для заполнения';
    if (!clientForm.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.email)) {
      newErrors.email = 'Неверный формат email';
    }
    if (!clientForm.phone.trim()) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(clientForm.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }
    if (!clientForm.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (clientForm.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    if (clientForm.password !== clientForm.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    if (!clientForm.acceptTerms) newErrors.acceptTerms = 'Необходимо принять условия использования';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAgentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setAgentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setClientForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = userType === 'agent' ? validateAgentForm() : validateClientForm();
    if (!isValid) return;

    setIsLoading(true);
    
    try {
      // Принудительная очистка перед регистрацией
      dispatch(forceLogout());
      
      const formData = userType === 'agent' ? {
        userType: 'agent' as const,
        firstName: agentForm.firstName,
        lastName: agentForm.lastName,
        username: agentForm.username,
        email: agentForm.email,
        phone: agentForm.phone,
        password: agentForm.password,
        confirmPassword: agentForm.confirmPassword,
        companyName: agentForm.companyName,
        organizationType: agentForm.organizationType as 'oao' | 'zao' | 'ooo' | 'ip',
        activityType: agentForm.activityType as 'logistics_company' | 'agency',
        language: 'ru' as const
      } : {
        userType: 'client' as const,
        firstName: clientForm.firstName,
        lastName: clientForm.lastName,
        username: clientForm.username,
        email: clientForm.email,
        phone: clientForm.phone,
        password: clientForm.password,
        confirmPassword: clientForm.confirmPassword,
        companyName: clientForm.companyName || undefined,
        language: 'ru' as const
      };

      // Используем Redux action для регистрации
      const result = await dispatch(registerUser(formData));
      
      if (registerUser.fulfilled.match(result)) {
        // Успешная регистрация - перенаправляем на верификацию
        navigate('/auth/verify-email', {
          state: { email: userType === 'agent' ? agentForm.email : clientForm.email }
        });
      } else {
        // Ошибка регистрации
        const errorMessage = result.payload as string || 'Ошибка при регистрации. Попробуйте снова.';
        setErrors({ email: errorMessage });
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ email: error.message || 'Ошибка при регистрации. Попробуйте снова.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeSelect = (selectedType: 'client' | 'agent') => {
    setUserType(selectedType);
    setCurrentStep(selectedType === 'agent' ? 'agentForm' : 'clientForm');
  };

  const handleBackToUserType = () => {
    setCurrentStep('userType');
    setErrors({});
  };

  const renderUserTypeSelection = () => (
    <div className="min-h-screen bg-bearplus-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img
              className="h-12 w-auto"
              src="/images/logo.png"
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

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div
            onClick={() => handleUserTypeSelect('agent')}
            className="relative cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-bearplus-green"
          >
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-750 transition-colors">
              <div className="text-6xl mb-4">👨‍💼</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">Агент</h3>
              <p className="text-gray-400 text-sm">
                Работаете в сфере логистики и хотите предоставлять услуги клиентам
              </p>
            </div>
          </div>

          <div
            onClick={() => handleUserTypeSelect('client')}
            className="relative cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-bearplus-green"
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

  const renderAgentForm = () => (
    <div className="min-h-screen bg-bearplus-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img
              className="h-12 w-auto"
              src="/images/logo.png"
              alt="BearPlus"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Регистрация агента
          </h2>
          <button
            type="button"
            onClick={handleBackToUserType}
            className="mt-2 text-sm text-gray-400 hover:text-bearplus-green underline"
          >
            Изменить тип аккаунта
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={agentForm.firstName}
                  onChange={handleAgentInputChange}
                  className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="Имя"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  name="lastName"
                  type="text"
                  required
                  value={agentForm.lastName}
                  onChange={handleAgentInputChange}
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Фамилия"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <input
                name="username"
                type="text"
                required
                value={agentForm.username}
                onChange={handleAgentInputChange}
                className={`input-field ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Логин"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <input
                name="email"
                type="email"
                required
                value={agentForm.email}
                onChange={handleAgentInputChange}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                name="phone"
                type="tel"
                required
                value={agentForm.phone}
                onChange={handleAgentInputChange}
                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Номер телефона"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <select
                name="organizationType"
                required
                value={agentForm.organizationType}
                onChange={handleAgentInputChange}
                className={`input-field ${errors.organizationType ? 'border-red-500' : ''}`}
              >
                <option value="">Выберите тип организации</option>
                <option value="oao">ОАО</option>
                <option value="zao">ЗАО</option>
                <option value="ooo">ООО</option>
                <option value="ip">ИП</option>
              </select>
              {errors.organizationType && (
                <p className="mt-1 text-sm text-red-500">{errors.organizationType}</p>
              )}
            </div>

            <div>
              <select
                name="activityType"
                required
                value={agentForm.activityType}
                onChange={handleAgentInputChange}
                className={`input-field ${errors.activityType ? 'border-red-500' : ''}`}
              >
                <option value="">Выберите тип деятельности</option>
                <option value="logistics_company">Логистическая Компания</option>
                <option value="agency">Агентирование</option>
              </select>
              {errors.activityType && (
                <p className="mt-1 text-sm text-red-500">{errors.activityType}</p>
              )}
            </div>

            <div>
              <input
                name="companyName"
                type="text"
                required
                value={agentForm.companyName}
                onChange={handleAgentInputChange}
                className={`input-field ${errors.companyName ? 'border-red-500' : ''}`}
                placeholder="Компания (название)"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={agentForm.password}
                  onChange={handleAgentInputChange}
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
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={agentForm.confirmPassword}
                  onChange={handleAgentInputChange}
                  className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Подтверждение пароля"
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

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    name="acceptTerms"
                    type="checkbox"
                    checked={agentForm.acceptTerms}
                    onChange={handleAgentInputChange}
                    className={`w-4 h-4 text-bearplus-green bg-gray-700 border-gray-600 rounded focus:ring-bearplus-green focus:ring-2 ${
                      errors.acceptTerms ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="text-gray-300">
                    Вы принимаете условия использования платформы
                  </label>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-500">{errors.acceptTerms}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    name="acceptOffer"
                    type="checkbox"
                    checked={agentForm.acceptOffer}
                    onChange={handleAgentInputChange}
                    className={`w-4 h-4 text-bearplus-green bg-gray-700 border-gray-600 rounded focus:ring-bearplus-green focus:ring-2 ${
                      errors.acceptOffer ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="text-gray-300">
                    Вы соглашаетесь с условиями нашей{' '}
                    <Link to="/offer" className="text-bearplus-green hover:text-bearplus-green/80 underline">
                      оферты
                    </Link>
                  </label>
                  {errors.acceptOffer && (
                    <p className="mt-1 text-sm text-red-500">{errors.acceptOffer}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-bearplus-green hover:bg-bearplus-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bearplus-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Регистрация...
                </div>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderClientForm = () => (
    <div className="min-h-screen bg-bearplus-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img
              className="h-12 w-auto"
              src="/images/logo.png"
              alt="BearPlus"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Регистрация клиента
          </h2>
          <button
            type="button"
            onClick={handleBackToUserType}
            className="mt-2 text-sm text-gray-400 hover:text-bearplus-green underline"
          >
            Изменить тип аккаунта
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={clientForm.firstName}
                  onChange={handleClientInputChange}
                  className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="Имя"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  name="lastName"
                  type="text"
                  required
                  value={clientForm.lastName}
                  onChange={handleClientInputChange}
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Фамилия"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <input
                name="companyName"
                type="text"
                value={clientForm.companyName}
                onChange={handleClientInputChange}
                className="input-field"
                placeholder="Наименование компании (необязательно)"
              />
            </div>

            <div>
              <input
                name="username"
                type="text"
                required
                value={clientForm.username}
                onChange={handleClientInputChange}
                className={`input-field ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Логин"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <input
                name="email"
                type="email"
                required
                value={clientForm.email}
                onChange={handleClientInputChange}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                name="phone"
                type="tel"
                required
                value={clientForm.phone}
                onChange={handleClientInputChange}
                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Номер телефона (коды стран)"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={clientForm.password}
                  onChange={handleClientInputChange}
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
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={clientForm.confirmPassword}
                  onChange={handleClientInputChange}
                  className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Подтверждение пароля"
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

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  name="acceptTerms"
                  type="checkbox"
                  checked={clientForm.acceptTerms}
                  onChange={handleClientInputChange}
                  className={`w-4 h-4 text-bearplus-green bg-gray-700 border-gray-600 rounded focus:ring-bearplus-green focus:ring-2 ${
                    errors.acceptTerms ? 'border-red-500' : ''
                  }`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="text-gray-300">
                  Вы принимаете политику конфиденциальности и условия пользования.{' '}
                  <Link to="/offer" className="text-bearplus-green hover:text-bearplus-green/80 underline">
                    Оферта
                  </Link>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-500">{errors.acceptTerms}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-bearplus-green hover:bg-bearplus-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bearplus-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Регистрация...
                </div>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (currentStep === 'userType') {
    return renderUserTypeSelection();
  } else if (currentStep === 'agentForm') {
    return renderAgentForm();
  } else {
    return renderClientForm();
  }
};

export default RegisterPage;