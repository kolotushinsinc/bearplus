import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email') || location.state?.email;

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  useEffect(() => {
    let interval: number;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const verifyEmail = async (verificationToken: string) => {
    setIsVerifying(true);
    
    try {
      console.log('Verifying email with token:', verificationToken);
      
      // Call real API for email verification
      const response = await authService.verifyEmail(verificationToken);
      
      if (response.success) {
        setVerificationStatus('success');
        
        // Redirect to login after successful verification
        setTimeout(() => {
          navigate('/auth/login', {
            state: {
              message: 'Email успешно подтвержден! Теперь вы можете войти в систему.'
            }
          });
        }, 3000);
      } else {
        setVerificationStatus('error');
      }
      
    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email || resendCooldown > 0) return;

    setIsResending(true);
    
    try {
      console.log('Resending verification email to:', email);
      
      // Call API to resend verification email
      // Note: This endpoint needs to be implemented in the backend
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005/api'}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      // Set cooldown for 60 seconds
      setResendCooldown(60);
      
    } catch (error) {
      console.error('Resend email error:', error);
    } finally {
      setIsResending(false);
    }
  };

  // Email verification in progress
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-bearplus-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <img
                className="h-12 w-auto"
                src="/logo.png"
                alt="BearPlus"
              />
            </Link>
            
            <div className="mt-6 mx-auto flex items-center justify-center h-16 w-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bearplus-green"></div>
            </div>
            
            <h2 className="mt-6 text-3xl font-bold text-white">
              Подтверждение email...
            </h2>
            
            <p className="mt-2 text-sm text-gray-400">
              Пожалуйста, подождите
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Successful verification
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-bearplus-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <img
                className="h-12 w-auto"
                src="/logo.png"
                alt="BearPlus"
              />
            </Link>
            
            {/* Success Icon */}
            <div className="mt-6 mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <span className="text-2xl">✅</span>
            </div>
            
            <h2 className="mt-6 text-3xl font-bold text-white">
              Email подтвержден!
            </h2>
            
            <div className="mt-4 text-sm text-gray-400 space-y-2">
              <p>
                Ваш email адрес успешно подтвержден.
              </p>
              <p>
                Сейчас вы будете перенаправлены на страницу входа.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bearplus-green"></div>
          </div>
        </div>
      </div>
    );
  }

  // Verification error
  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-bearplus-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <img
                className="h-12 w-auto"
                src="/logo.png"
                alt="BearPlus"
              />
            </Link>
            
            {/* Error Icon */}
            <div className="mt-6 mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <span className="text-2xl">❌</span>
            </div>
            
            <h2 className="mt-6 text-3xl font-bold text-white">
              Ошибка подтверждения
            </h2>
            
            <div className="mt-4 text-sm text-gray-400 space-y-2">
              <p>
                Не удалось подтвердить ваш email адрес.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-bearplus-card rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">
                Возможные причины:
              </h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Ссылка уже была использована</li>
                <li>• Ссылка истекла</li>
                <li>• Ссылка была скопирована неполностью</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-2">
              {email && (
                <button
                  onClick={handleResendEmail}
                  disabled={isResending || resendCooldown > 0}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Отправка...
                    </div>
                  ) : resendCooldown > 0 ? (
                    `Повторить через ${resendCooldown} сек`
                  ) : (
                    'Отправить новое письмо'
                  )}
                </button>
              )}
              
              <Link
                to="/auth/login"
                className="btn-secondary w-full text-center"
              >
                Вернуться к входу
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default state - waiting for email verification
  return (
    <div className="min-h-screen bg-bearplus-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img
              className="h-12 w-auto"
              src="/logo.png"
              alt="BearPlus"
            />
          </Link>
          
          {/* Email Icon */}
          <div className="mt-6 mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <span className="text-2xl">📧</span>
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-white">
            Подтвердите ваш email
          </h2>
          
          <div className="mt-4 text-sm text-gray-400 space-y-2">
            <p>
              Мы отправили письмо с подтверждением на адрес:
            </p>
            {email && (
              <p className="font-medium text-bearplus-green">
                {email}
              </p>
            )}
            <p>
              Проверьте почту и нажмите на ссылку в письме для подтверждения аккаунта.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-bearplus-card rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-2">
              Не получили письмо?
            </h3>
            <ul className="text-xs text-gray-400 space-y-1 mb-3">
              <li>• Проверьте папку "Спам" или "Нежелательная почта"</li>
              <li>• Убедитесь, что email адрес указан правильно</li>
              <li>• Письмо может прийти в течение 5-10 минут</li>
            </ul>
            
            {email && (
              <button
                onClick={handleResendEmail}
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
                  'Отправить письмо повторно'
                )}
              </button>
            )}
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
            Ссылка для подтверждения email действительна в течение 24 часов.
            Если вы не создавали аккаунт в BearPlus, проигнорируйте это письмо.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;