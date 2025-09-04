import axios, { AxiosResponse } from 'axios';
import {
  LoginFormData,
  RegisterFormData,
  User,
  ApiResponse
} from '../types';

// Базовая конфигурация axios
const API_BASE_URL = 'http://localhost:5005/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Включаем отправку cookies
  timeout: 10000, // 10 секунд таймаут
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect on auth errors - let components handle it
    return Promise.reject(error);
  }
);

class AuthService {
  // Вход пользователя
  async login(loginData: LoginFormData): Promise<{ user: User; token: string }> {
    try {
      const response: AxiosResponse<ApiResponse> = await api.post('/auth/login', loginData);
      
      if (response.data.success && response.data.user && response.data.token) {
        return {
          user: response.data.user,
          token: response.data.token
        };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error occurred');
    }
  }

  // Регистрация пользователя
  async register(registerData: RegisterFormData): Promise<{ user: User; message: string }> {
    try {
      const response: AxiosResponse<ApiResponse> = await api.post('/auth/register', registerData);
      
      if (response.data.success && response.data.user) {
        return {
          user: response.data.user,
          message: response.data.message || 'Registration successful'
        };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.data?.errors) {
        const errorMessage = error.response.data.errors
          .map((err: any) => err.msg)
          .join(', ');
        throw new Error(errorMessage);
      }
      throw new Error('Network error occurred');
    }
  }

  // Получение текущего пользователя
  async getMe(): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await api.get('/auth/me');
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to get user data');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error occurred');
    }
  }

  // Выход пользователя
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      // Игнорируем ошибки logout на сервере
      console.warn('Logout request failed:', error.message);
    }
  }

  // Запрос сброса пароля
  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error occurred');
    }
  }

  // Сброс пароля
  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<{ user: User; token: string }> {
    try {
      const response: AxiosResponse<ApiResponse> = await api.put(
        `/auth/reset-password/${token}`,
        { password, confirmPassword }
      );
      
      if (response.data.success && response.data.user && response.data.token) {
        return {
          user: response.data.user,
          token: response.data.token
        };
      } else {
        throw new Error(response.data.message || 'Password reset failed');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error occurred');
    }
  }

  // Подтверждение email
  async verifyEmail(token: string): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await api.get(`/auth/verify-email/${token}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Email verification failed');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error occurred');
    }
  }

  // Проверка валидности токена
  async validateToken(): Promise<boolean> {
    try {
      const response = await this.getMe();
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;