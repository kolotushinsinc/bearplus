import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, LoginFormData, RegisterFormData, ApiResponse } from '../../types';
import authService from '../../services/authService';

// Проверяем localStorage на наличие информации об авторизации
const getInitialAuthState = (): boolean => {
  try {
    const authFlag = localStorage.getItem('isAuthenticated');
    return authFlag === 'true';
  } catch {
    return false;
  }
};

// Начальное состояние
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: getInitialAuthState(),
  error: null,
};

// Async thunks для аутентификации
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginFormData,
  { rejectValue: string }
>(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(loginData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk<
  { user: User; message: string },
  RegisterFormData,
  { rejectValue: string }
>(
  'auth/register',
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await authService.register(registerData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMe();
      if (!response.user) {
        return rejectWithValue('User data not found');
      }
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user data');
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const forgotPassword = createAsyncThunk<
  string,
  { email: string },
  { rejectValue: string }
>(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response.message || 'Password reset email sent';
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send reset email');
    }
  }
);

export const resetPassword = createAsyncThunk<
  { user: User; token: string },
  { token: string; password: string; confirmPassword: string },
  { rejectValue: string }
>(
  'auth/resetPassword',
  async ({ token, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, password, confirmPassword);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password reset failed');
    }
  }
);

export const verifyEmail = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(token);
      return response.message || 'Email verified successfully';
    } catch (error: any) {
      return rejectWithValue(error.message || 'Email verification failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    forceLogout: (state) => {
      // Принудительная полная очистка всех данных
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      
      // Очистка всех возможных ключей localStorage
      const keysToRemove = [
        'isAuthenticated', 'token', 'user', 'bearplus_user', 'auth_token',
        'authState', 'currentUser', 'userData', 'userProfile', 'sessionData'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Очистка всего localStorage и sessionStorage для надежности
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.warn('Error clearing storage:', e);
      }
      
      // Очистка cookies через перезагрузку страницы
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
      });
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      // Полная очистка localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('bearplus_user');
      localStorage.removeItem('auth_token');
      // Очистка sessionStorage
      sessionStorage.clear();
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('isAuthenticated', 'true');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // После регистрации пользователь не авторизован, нужно подтвердить email
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('isAuthenticated', 'true');
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = null; // Don't show error on initial auth check
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('isAuthenticated');
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
        // Полная очистка localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('bearplus_user');
        localStorage.removeItem('auth_token');
        // Очистка sessionStorage
        sessionStorage.clear();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        // Даже если logout не удался на сервере, очищаем локальные данные
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
        // Полная очистка localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('bearplus_user');
        localStorage.removeItem('auth_token');
        // Очистка sessionStorage
        sessionStorage.clear();
      });

    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to send reset email';
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('isAuthenticated', 'true');
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Password reset failed';
      });

    // Verify email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Обновляем статус верификации email, если пользователь залогинен
        if (state.user) {
          state.user.isEmailVerified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Email verification failed';
      });
  },
});

export const { clearError, setCredentials, clearCredentials, updateUser, forceLogout } = authSlice.actions;

export default authSlice.reducer;