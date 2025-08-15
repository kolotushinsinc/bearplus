import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginData } from '../../services/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({
    login: '',
    password: '',
    general: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = { login: '', password: '', general: '' };
    let isValid = true;

    if (!formData.login.trim()) {
      newErrors.login = 'Введите email';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.login)) {
      newErrors.login = 'Введите корректный email';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Введите пароль';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        setErrors({ login: '', password: '', general: '' });
        
        const loginData: LoginData = {
          email: formData.login, // В API используется email для логина
          password: formData.password
        };

        const response = await login(loginData);
        
        if (response.success) {
          // Перенаправляем в личный кабинет
          navigate('/dashboard');
        }
      } catch (error: any) {
        console.error('Login failed:', error);
        
        const errorMessage = error.message || 'Произошла ошибка при входе';
        
        if (errorMessage.includes('Invalid credentials') || errorMessage.includes('credentials')) {
          setErrors(prev => ({ 
            ...prev, 
            general: 'Неверный email или пароль' 
          }));
        } else if (errorMessage.includes('Account temporarily locked')) {
          setErrors(prev => ({ 
            ...prev, 
            general: 'Аккаунт временно заблокирован из-за множественных попыток входа' 
          }));
        } else if (errorMessage.includes('Account is deactivated')) {
          setErrors(prev => ({ 
            ...prev, 
            general: 'Аккаунт деактивирован' 
          }));
        } else {
          setErrors(prev => ({ 
            ...prev, 
            general: 'Ошибка входа. Попробуйте снова.' 
          }));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очистить ошибки при изменении полей
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '', general: '' }));
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Вход</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Общая ошибка */}
          {errors.general && (
            <div className="text-red-400 text-sm text-center mb-4">{errors.general}</div>
          )}

          {/* Email и Пароль */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="email"
                name="login"
                value={formData.login}
                onChange={handleChange}
                className={`input-field w-full ${errors.login ? 'error' : ''}`}
                placeholder="Email"
                required
              />
              {errors.login && (
                <p className="text-red-400 text-sm mt-1">{errors.login}</p>
              )}
            </div>

            {/* Пароль */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input-field w-full pr-12 ${errors.password ? 'error' : ''}`}
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
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Запомнить меня */}
          <div className="flex items-center justify-center mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="checkbox-custom mr-2"
              />
              <span className="text-sm text-gray-300">Запомнить меня</span>
            </label>
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            className="btn-green w-full mt-8 py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>

          {/* Восстановить пароль */}
          <div className="text-center mt-6">
            <Link 
              to="/forgot-password" 
              className="text-bearplus-green hover:text-bearplus-green/80 transition-colors text-sm"
            >
              Восстановить пароль
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;