import * as React from 'react';
import { useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authApi, ResetPasswordData } from '../../services/api';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [formData, setFormData] = useState({
    code: ['', '', '', ''],
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate code
    const codeString = formData.code.join('');
    if (codeString.length !== 4) {
      newErrors.code = 'Введите 4-значный код';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        setErrors({});
        
        if (!token) {
          setErrors(prev => ({ ...prev, general: 'Токен сброса пароля отсутствует' }));
          return;
        }
        
        const resetPasswordData: ResetPasswordData = {
          password: formData.password,
          confirmPassword: formData.confirmPassword
        };

        const response = await authApi.resetPassword(token, resetPasswordData);
        
        if (response.success) {
          setIsSuccess(true);
        }
      } catch (error: any) {
        console.error('Reset password failed:', error);
        
        const errorMessage = error.message || 'Произошла ошибка';
        
        if (errorMessage.includes('Invalid or expired') || errorMessage.includes('token')) {
          setErrors(prev => ({
            ...prev,
            general: 'Недействительный или истекший токен сброса пароля'
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            general: 'Ошибка смены пароля. Попробуйте снова.'
          }));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...formData.code];
    newCode[index] = value;
    setFormData(prev => ({ ...prev, code: newCode }));

    // Clear code errors when user starts typing
    if (errors.code) {
      setErrors(prev => ({ ...prev, code: '' }));
    }

    // Auto-focus next input
    if (value && index < 3) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !formData.code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleResendCode = () => {
    // TODO: Implement resend code logic
    console.log('Resending code...');
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="form-container animate-scale-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-bearplus-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Пароль изменен!</h1>
            <p className="text-gray-400 mb-8">
              Ваш пароль был успешно изменен.
              <br />
              Теперь вы можете войти в систему с новым паролем.
            </p>
            <Link 
              to="/login" 
              className="btn-primary w-full block text-center"
            >
              Войти в систему
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
          <h1 className="text-3xl font-bold text-white mb-2">Восстановление пароля</h1>
          <p className="text-gray-400">
            Введите 4-значный код, отправленный на ваш e-mail
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Verification Code */}
          <div>
            <div className="flex justify-center gap-4 mb-2">
              {formData.code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => codeInputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  className={`verification-input ${errors.code ? 'error' : ''}`}
                  style={{
                    width: '60px',
                    height: '60px',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                />
              ))}
            </div>
            {errors.code && (
              <div className="text-red-400 text-sm text-center">{errors.code}</div>
            )}
          </div>

          {/* New Password Section */}
          <div className="text-center">
            <p className="text-gray-300 text-lg mb-4">Придумайте новый пароль</p>
          </div>

          {/* Password Fields in Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
                className={`input-field w-full ${errors.password ? 'error' : ''}`}
                placeholder="Пароль"
                minLength={8}
                required
              />
              {errors.password && (
                <div className="text-red-400 text-sm mt-1">{errors.password}</div>
              )}
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handlePasswordChange}
                className={`input-field w-full ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Подтверждение пароля"
                minLength={8}
                required
              />
              {errors.confirmPassword && (
                <div className="text-red-400 text-sm mt-1">{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn-green w-full"
          >
            Сохранить и войти
          </button>

          <div className="text-center">
            <span className="text-gray-400">Код не пришел? </span>
            <button
              type="button"
              onClick={handleResendCode}
              className="text-bearplus-green hover:text-bearplus-green/80 transition-colors font-medium"
            >
              Отправить еще раз
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;