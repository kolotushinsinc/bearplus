import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, ForgotPasswordData } from '../../services/api';

const ForgotPasswordPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Поле обязательно для заполнения';
    } else {
      // Simple validation for email or phone
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[\+]?[0-9]{10,15}$/;
      
      if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone.replace(/\s/g, ''))) {
        newErrors.emailOrPhone = 'Введите корректный email или номер телефона';
      }
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
        
        const forgotPasswordData: ForgotPasswordData = {
          email: emailOrPhone // В API используется email
        };

        const response = await authApi.forgotPassword(forgotPasswordData);
        
        if (response.success) {
          setIsSuccess(true);
        }
      } catch (error: any) {
        console.error('Forgot password failed:', error);
        
        const errorMessage = error.message || 'Произошла ошибка';
        
        if (errorMessage.includes('User not found') || errorMessage.includes('not found')) {
          setErrors(prev => ({
            ...prev,
            emailOrPhone: 'Пользователь с таким email не найден'
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            general: 'Ошибка отправки. Попробуйте снова.'
          }));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailOrPhone(e.target.value);
    // Clear errors when user starts typing
    if (errors.emailOrPhone) {
      setErrors(prev => ({
        ...prev,
        emailOrPhone: ''
      }));
    }
  };


  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-8">Восстановление пароля</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              id="emailOrPhone"
              name="emailOrPhone"
              value={emailOrPhone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-bearplus-green focus:outline-none transition-colors ${errors.emailOrPhone ? 'border-red-400' : ''}`}
              placeholder="E-mail или телефон"
              required
            />
            {errors.emailOrPhone && (
              <div className="text-red-400 text-sm mt-1">{errors.emailOrPhone}</div>
            )}
          </div>

          {/* Общие ошибки */}
          {errors.general && (
            <div className="text-red-400 text-sm text-center">{errors.general}</div>
          )}

          <button
            type="submit"
            className="w-full bg-bearplus-green hover:bg-green-500 text-black font-medium py-3 px-6 rounded transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Отправка...' : 'Получить код'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;