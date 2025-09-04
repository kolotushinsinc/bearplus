import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { setCredentials } from '../../store/slices/authSlice';
import { apiService } from '../../services/apiService';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!email || !code) {
      navigate('/auth/forgot-password');
    }
  }, [email, code, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !email || !code) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiService.passwordReset.resetPassword(
        email,
        code,
        formData.password,
        formData.confirmPassword
      );

      if (response.success && response.data) {
        // Auto-login after successful password reset
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token
        }));

        setIsSuccess(true);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setErrors({
          password: response.message || 'Ошибка при сбросе пароля. Попробуйте еще раз.'
        });
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      setErrors({
        password: 'Произошла ошибка. Попробуйте позже.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;

    if (strength >= 75) return { strength, label: '🔒 Отличный пароль', color: 'text-tech-success' };
    if (strength >= 50) return { strength, label: '🔑 Хороший пароль', color: 'text-tech-warning' };
    if (strength >= 25) return { strength, label: '⚠️ Слабый пароль', color: 'text-tech-error' };
    return { strength, label: '❌ Очень слабый пароль', color: 'text-tech-error' };
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-tech-gradient flex items-center justify-center p-4">
        <div className="form-container w-full max-w-md text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-tech-success/20 rounded-xl border border-tech-success/30 glow-tech-sm">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="logo-text text-gradient">BearPlus</h1>
          </div>
          
          <h2 className="text-tech-title mb-6">Пароль успешно изменен!</h2>
          <p className="text-tech-caption mb-8">
            Вы автоматически авторизованы в системе. Перенаправление в личный кабинет...
          </p>
          
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-tech-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!email || !code) {
    return null;
  }

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-tech-gradient flex items-center justify-center p-4">
      <div className="form-container w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-tech-primary/10 rounded-xl border border-tech-primary/20">
              <span className="text-3xl">🔒</span>
            </div>
            <h1 className="logo-text text-gradient">BearPlus</h1>
          </div>
          <h2 className="text-tech-title mb-3">Создание нового пароля</h2>
          <p className="text-tech-caption">
            Введите новый пароль для вашего аккаунта
          </p>
          <div className="mt-4 p-3 bg-tech-success/10 rounded-lg border border-tech-success/20">
            <p className="text-tech-mono text-xs">✅ Код подтвержден для {email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.password && !errors.confirmPassword && (
            <div className="alert alert-error">
              <span className="text-lg">❌</span>
              <span>{errors.password}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              🔑 Новый пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input-field ${errors.password ? 'error' : ''}`}
              placeholder="Минимум 6 символов"
              disabled={isLoading}
              required
            />
            {errors.password && (
              <p className="text-tech-error text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              🔐 Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`input-field ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Повторите пароль"
              disabled={isLoading}
              required
            />
            {errors.confirmPassword && (
              <p className="text-tech-error text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="text-tech-caption">Надежность пароля:</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill transition-all duration-300" 
                  style={{ width: `${passwordStrength.strength}%` }}
                ></div>
              </div>
              <div className={`text-tech-mono text-xs ${passwordStrength.color}`}>
                {passwordStrength.label}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full relative"
            disabled={isLoading || !formData.password || !formData.confirmPassword}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-tech-bg border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
              💾 Сохранить и войти
            </span>
          </button>

          <div className="text-center">
            <Link 
              to="/auth/login" 
              className="text-tech-text-muted hover:text-tech-primary transition-colors text-sm"
            >
              ← Вернуться к входу
            </Link>
          </div>
        </form>

        {/* Security Tips */}
        <div className="card mt-8 bg-tech-surface border-tech-border-light">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-tech-info/10 rounded-lg border border-tech-info/20">
              <span className="text-sm">💡</span>
            </div>
            <div>
              <h3 className="text-tech-caption font-medium mb-2">Советы по безопасности:</h3>
              <ul className="text-tech-mono text-xs space-y-1">
                <li>• Используйте уникальный пароль</li>
                <li>• Включите заглавные и строчные буквы</li>
                <li>• Добавьте цифры и спецсимволы</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;