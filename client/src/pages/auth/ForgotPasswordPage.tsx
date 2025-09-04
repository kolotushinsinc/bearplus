import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email обязателен для заполнения');
      return;
    }

    if (!validateEmail(email)) {
      setError('Неверный формат email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.passwordReset.requestCode(email);
      
      if (response.success) {
        // Переходим к странице ввода кода
        navigate(`/auth/verify-reset-code?email=${encodeURIComponent(email)}`);
      } else {
        setError(response.message || 'Произошла ошибка. Попробуйте позже.');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setError('Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tech-gradient flex items-center justify-center p-4">
      <div className="form-container w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-tech-primary/10 rounded-xl border border-tech-primary/20">
              <span className="text-3xl">🔑</span>
            </div>
            <h1 className="logo-text text-gradient">BearPlus</h1>
          </div>
          <h2 className="text-tech-title mb-3">Забыли пароль?</h2>
          <p className="text-tech-caption">
            Введите ваш email адрес и мы отправим 4-значный код для восстановления пароля
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <span className="text-lg">❌</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              📧 Email адрес
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(''); // Очищаем ошибку при вводе
              }}
              className={`input-field ${error ? 'error' : ''}`}
              placeholder="your@email.com"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full relative"
            disabled={isLoading || !email.trim()}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-tech-bg border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
              📤 Отправить код
            </span>
          </button>

          <div className="text-center space-y-4">
            <p className="text-tech-caption">
              Вспомнили пароль?{' '}
              <Link to="/auth/login" className="text-tech-primary hover:text-tech-accent transition-colors font-medium">
                Войти в аккаунт
              </Link>
            </p>
            <p className="text-tech-caption">
              Нет аккаунта?{' '}
              <Link to="/auth/register" className="text-tech-primary hover:text-tech-accent transition-colors font-medium">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </form>

        {/* Security Info */}
        <div className="card mt-8 bg-tech-surface border-tech-border-light">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-tech-info/10 rounded-lg border border-tech-info/20">
              <span className="text-sm">🔒</span>
            </div>
            <div>
              <h3 className="text-tech-caption font-medium mb-2">Безопасность</h3>
              <p className="text-tech-mono text-xs">
                Код будет действителен в течение 10 минут. 
                По соображениям безопасности мы не сообщаем, зарегистрирован ли email в системе.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;