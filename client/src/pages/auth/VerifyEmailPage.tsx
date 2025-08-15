import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`verify-code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement email verification logic
    console.log('Verification code:', verificationCode.join(''));
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleResend = () => {
    // TODO: Implement resend logic
    console.log('Resending verification email...');
  };

  useEffect(() => {
    // Auto-submit when all fields are filled
    if (verificationCode.every(digit => digit !== '')) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [verificationCode]);

  if (isSuccess) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="form-container animate-scale-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-bearplus-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Email подтвержден!</h1>
            <p className="text-gray-400 mb-8">
              Ваш email успешно подтвержден.
              <br />
              Добро пожаловать в BearPlus!
            </p>
            <Link 
              to="/dashboard" 
              className="btn-primary w-full block text-center"
            >
              Перейти в панель управления
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="form-container animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Подтверждение аккаунта</h1>
          <p className="text-gray-400">
            Введите 4-значный код, отправленный на ваш e-mail
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center space-x-4">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`verify-code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                className="verification-input"
                maxLength={1}
                pattern="[0-9]"
                disabled={isLoading}
                required
              />
            ))}
          </div>

          {isLoading && (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-bearplus-green border-t-transparent rounded-full spinner"></div>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={verificationCode.some(digit => !digit) || isLoading}
          >
            {isLoading ? 'Подтверждаем...' : 'Подтвердить'}
          </button>

          <div className="text-center space-y-2">
            <p className="text-gray-400 text-sm">Не получили код?</p>
            <button
              type="button"
              onClick={handleResend}
              className="text-bearplus-green hover:text-bearplus-green/80 transition-colors text-sm"
              disabled={isLoading}
            >
              Отправить повторно
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="text-center">
            <Link 
              to="/login" 
              className="text-bearplus-green hover:text-bearplus-green/80 transition-colors font-medium"
            >
              ← Вернуться к входу
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;