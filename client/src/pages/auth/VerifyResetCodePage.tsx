import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const VerifyResetCodePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (!email) {
      navigate('/auth/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    // Focus первый input при загрузке
    inputRefs[0].current?.focus();
  }, []);

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
      const response = await apiService.passwordReset.verifyCode(email, fullCode);

      if (response.success) {
        // Переходим к странице сброса пароля с кодом
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}&code=${fullCode}`);
      } else {
        setError(response.message || 'Неверный код. Попробуйте еще раз.');
        setCode(['', '', '', '']);
        inputRefs[0].current?.focus();
      }
    } catch (error) {
      console.error('Verify code error:', error);
      setError('Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);
    setError('');

    try {
      const response = await apiService.passwordReset.requestCode(email);
      
      if (response.success) {
        setCode(['', '', '', '']);
        inputRefs[0].current?.focus();
        alert('Новый код отправлен на ваш email');
      } else {
        setError(response.message || 'Ошибка при отправке кода');
      }
    } catch (error) {
      console.error('Resend code error:', error);
      setError('Произошла ошибка при отправке кода');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-tech-gradient flex items-center justify-center p-4">
      <div className="form-container w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-tech-primary/10 rounded-xl border border-tech-primary/20">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="logo-text text-gradient">BearPlus</h1>
          </div>
          <h2 className="text-tech-title mb-3">Проверка кода</h2>
          <p className="text-tech-caption">
            Введите 4-значный код, отправленный на
          </p>
          <p className="text-tech-primary font-medium mt-1">{email}</p>
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
                className={`verification-input ${error ? 'error' : ''}`}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="text-lg">❌</span>
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleVerifyCode}
            disabled={isLoading || code.some(digit => digit === '')}
            className="btn-primary w-full relative"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-tech-bg border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
              🔓 Проверить код
            </span>
          </button>

          <div className="text-center space-y-4">
            <p className="text-tech-caption">
              Не получили код?
            </p>
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="btn-secondary btn-sm"
            >
              {isResending ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-tech-primary border-t-transparent rounded-full animate-spin"></div>
                  Отправка...
                </div>
              ) : (
                '📧 Отправить код повторно'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/auth/forgot-password')}
              className="text-tech-text-muted hover:text-tech-primary transition-colors text-sm"
            >
              ← Вернуться к вводу email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetCodePage;