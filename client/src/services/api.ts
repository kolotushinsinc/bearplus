// Import types from the main types file
import {
  User,
  ApiResponse,
  RegisterFormData as RegisterData,
  LoginFormData as LoginData,
  ForgotPasswordFormData as ForgotPasswordData,
  ResetPasswordFormData as ResetPasswordData
} from '../types';

// Re-export types for compatibility
export type { User, ApiResponse, RegisterData, LoginData, ForgotPasswordData, ResetPasswordData };

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api';

// HTTP client class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(token: string, data: ResetPasswordData): Promise<ApiResponse<User>> {
    return this.request<User>(`/auth/reset-password/${token}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return this.request(`/auth/verify-email/${token}`);
  }
}

// Create and export API instance
export const api = new ApiClient(API_BASE_URL);

// Export individual functions for convenience
export const authApi = {
  register: (data: RegisterData) => api.register(data),
  login: (data: LoginData) => api.login(data),
  logout: () => api.logout(),
  getMe: () => api.getMe(),
  forgotPassword: (data: ForgotPasswordData) => api.forgotPassword(data),
  resetPassword: (token: string, data: ResetPasswordData) => api.resetPassword(token, data),
  verifyEmail: (token: string) => api.verifyEmail(token),
};