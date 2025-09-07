import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import { useAppDispatch } from '../../hooks/redux';
import { forceLogout } from '../../store/slices/authSlice';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  
  const email = searchParams.get('email') || location.state?.email;

  // Принудительная очистка при входе на страницу верификации
  React.useEffect(() => {
    dispatch(forceLogout());
  }, [dispatch]);

  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (!email) {
      navigate('/auth/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    // Focus первый input при загрузке
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    let interval: number;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Если вставили сразу весь код
      const fullCode = value.slice(0, 4).split('');
      setCode(fullCode.concat(['', '', '', '']).slice(0, 4));
      
      // Фокус на последний введенный элемент
      const lastIndex = Math.min(fullCode.length - 1, 3);
      inputRefs[lastIndex].current?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) {
      return; // Только цифры
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Автоматический переход к следующему полю
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Переход к предыдущему полю при Backspace
      inputRefs[index - 1].current?.focus();
    }
    
    if (e.key === 'Enter' && code.every(digit => digit !== '')) {
      handleVerifyCode();
    }
  };

  const handleVerifyCode = async () => {
    if (!email || code.some(digit => digit === '')) {
      setError('Введите полный 4-значный код');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const fullCode = code.join('');
      await authService.verifyEmailCode(email, fullCode);

      // Успешная верификация - принудительная очистка всех данных
      dispatch(forceLogout());
      
      navigate('/auth/login', {
        state: {
          message: 'Email успешно подтвержден! Теперь вы можете войти в систему.',
          email: email // Передаем email для автозаполнения
        }
      });
    } catch (error: any) {
      console.error('Email verification error:', error);
      setError(error.message || 'Неверный код. Попробуйте еще раз.');
      setCode(['', '', '', '']);
      inputRefs[0].current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || resendCooldown > 0) return;

    setIsResending(true);
    setError('');

    try {
      await authService.resendVerificationEmail(email);
      setResendCooldown(60);
      setCode(['', '', '', '']);
      inputRefs[0].current?.focus();
    } catch (error: any) {
      console.error('Resend email error:', error);
      setError('Ошибка при отправке кода');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
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
          
          <div className="mt-6 mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-bearplus-green/10 border border-bearplus-green/20">
            <span className="text-2xl">📧</span>
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-white">
            Подтвердите email
          </h2>
          
          <div className="mt-4 text-sm text-gray-400 space-y-2">
            <p>
              Мы отправили 4-значный код на:
            </p>
            <p className="font-medium text-bearplus-green">
              {email}
            </p>
            <p>
              Введите код для подтверждения регистрации
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 4-digit Code Input */}
          <div className="flex justify-center gap-4 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-xl font-bold bg-gray-700 border rounded-lg focus:ring-2 focus:ring-bearplus-green focus:border-bearplus-green text-white ${
                  error ? 'border-red-500' : 'border-gray-600'
                }`}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-center">
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleVerifyCode}
            disabled={isLoading || code.some(digit => digit === '')}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-bearplus-green hover:bg-bearplus-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bearplus-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Проверка кода...
              </div>
            ) : (
              'Подтвердить email'
            )}
          </button>

          <div className="bg-bearplus-card rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-2">
              Не получили код?
            </h3>
            <ul className="text-xs text-gray-400 space-y-1 mb-3">
              <li>• Проверьте папку "Спам" или "Нежелательная почта"</li>
              <li>• Убедитесь, что email адрес указан правильно</li>
              <li>• Код может прийти в течение 2-3 минут</li>
            </ul>
            
            <button
              onClick={handleResendCode}
              disabled={isResending || resendCooldown > 0}
              className="btn-secondary w-full text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                  Отправка...
                </div>
              ) : resendCooldown > 0 ? (
                `Отправить повторно (${resendCooldown})`
              ) : (
                'Отправить код повторно'
              )}
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              to="/auth/login"
              className="btn-primary w-full text-center"
            >
              Вернуться к входу
            </Link>
            
            <Link
              to="/auth/register"
              className="text-center text-sm text-bearplus-green hover:text-bearplus-green/80"
            >
              Зарегистрировать другой аккаунт
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-bearplus-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-2">
            Безопасность
          </h3>
          <p className="text-xs text-gray-400">
            Код подтверждения действителен в течение 30 минут.
            Если вы не создавали аккаунт в BearPlus, проигнорируйте это письмо.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;