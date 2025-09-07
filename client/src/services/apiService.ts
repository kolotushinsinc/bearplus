import { api } from './api';

// Types for API responses
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Orders API
export const ordersApi = {
  getOrders: async (params?: { status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/orders?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  getOrderById: async (orderId: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/orders/${orderId}`, {
      credentials: 'include',
    });
    return response.json();
  },

  createOrder: async (orderData: any): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  confirmStage: async (orderId: string, stageId: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/orders/${orderId}/stages/${stageId}/confirm`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },

  updateOrderStatus: async (orderId: string, status: string, notes?: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status, notes }),
    });
    return response.json();
  },

  deleteOrder: async (orderId: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/orders/${orderId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.json();
  }
};

// Documents API
export const documentsApi = {
  getDocuments: async (params?: { type?: string; orderId?: string; status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.orderId) queryParams.append('orderId', params.orderId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/documents?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  uploadDocuments: async (files: FileList, type?: string, orderId?: string): Promise<ApiResponse> => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('documents', file);
    });
    if (type) formData.append('type', type);
    if (orderId) formData.append('orderId', orderId);

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/documents/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    return response.json();
  },

  getDocumentById: async (documentId: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/documents/${documentId}`, {
      credentials: 'include',
    });
    return response.json();
  },

  downloadDocument: async (documentId: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/documents/${documentId}/download`, {
      credentials: 'include',
    });
    
    // Check if response is JSON (mock document) or binary (real file)
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      // Mock document - handle JSON response
      const data = await response.json();
      if (data.success && data.downloadUrl) {
        // Convert relative URL to absolute URL for static files
        const fullUrl = data.downloadUrl.startsWith('http')
          ? data.downloadUrl
          : `${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api'}${data.downloadUrl}`;
        window.open(fullUrl, '_blank');
      } else {
        console.error('Download failed:', data.message);
        alert('Ошибка при скачивании: ' + (data.message || 'Неизвестная ошибка'));
      }
    } else {
      // Real file - handle binary response
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Get filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'download';
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Download failed:', response.statusText);
        alert('Ошибка при скачивании файла');
      }
    }
  },

  deleteDocument: async (documentId: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/documents/${documentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.json();
  }
};

// Messages API
export const messagesApi = {
  getChats: async (params?: { page?: number; limit?: number }): Promise<PaginatedResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/messages/chats?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  getChatMessages: async (chatId: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/messages/chats/${chatId}/messages?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  sendMessage: async (chatId: string, content: string, type: string = 'text'): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/messages/chats/${chatId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content, type }),
    });
    return response.json();
  },

  markAsRead: async (chatId: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/messages/chats/${chatId}/read`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },

  createChat: async (title: string, participantIds: string[], orderId?: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/messages/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, participantIds, orderId }),
    });
    return response.json();
  }
};

// Shipping API
export const shippingApi = {
  calculateRate: async (data: any): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/shipping/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  submitDangerousCargoRequest: async (data: any): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/shipping/dangerous-cargo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  }
};

// Rates API (for agents)
export const ratesApi = {
  getRates: async (params?: { page?: number; limit?: number; type?: string; search?: string }): Promise<PaginatedResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type && params.type !== 'all') queryParams.append('type', params.type);
    if (params?.search) queryParams.append('search', params.search);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/rates?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  createRate: async (rateData: any): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/rates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(rateData),
    });
    return response.json();
  },

  updateRate: async (rateId: string, rateData: any): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/rates/${rateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(rateData),
    });
    return response.json();
  },

  deleteRate: async (rateId: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/rates/${rateId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.json();
  },

  uploadExcel: async (file: File, rateType: string): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('rateType', rateType);

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/rates/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    return response.json();
  },

  exportRates: async (params?: { type?: string; format?: string }): Promise<void> => {
    const queryParams = new URLSearchParams();
    if (params?.type && params.type !== 'all') queryParams.append('type', params.type);
    if (params?.format) queryParams.append('format', params.format);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/rates/export?${queryParams}`, {
      credentials: 'include',
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rates_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  },

  downloadTemplate: async (): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/rates/template`, {
      credentials: 'include',
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rates_template_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
};

// Loyalty API (for agents)
export const loyaltyApi = {
  getClients: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/loyalty/clients?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  },

  getLoyaltyRules: async (): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/loyalty/rules`, {
      credentials: 'include',
    });
    return response.json();
  },

  updateClientDiscount: async (clientId: string, discount: number, reason: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/loyalty/clients/${clientId}/discount`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ discount, reason }),
    });
    return response.json();
  },

  calculateSuggestedDiscount: async (clientId: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/loyalty/clients/${clientId}/suggested-discount`, {
      credentials: 'include',
    });
    return response.json();
  },

  getDiscountHistory: async (clientId?: string): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (clientId) queryParams.append('clientId', clientId);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/loyalty/history?${queryParams}`, {
      credentials: 'include',
    });
    return response.json();
  }
};

// Margins API (for agents)
export const marginsApi = {
  getMarginSettings: async (): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/margins`, {
      credentials: 'include',
    });
    return response.json();
  },

  updateMarginSetting: async (marginId: string, data: any): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/margins/${marginId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  calculateMargin: async (baseAmount: number, serviceType: string, currency?: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/margins/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ baseAmount, serviceType, currency }),
    });
    return response.json();
  }
};

// Currency API
export const currencyApi = {
  getCurrencyRates: async (): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/currency/rates`, {
      credentials: 'include',
    });
    return response.json();
  },

  updateCurrencyRates: async (): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/currency/update`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },

  convertCurrency: async (amount: number, fromCurrency: string, toCurrency: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/currency/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ amount, fromCurrency, toCurrency }),
    });
    return response.json();
  }
};

// Password Reset API (new flow with 4-digit code)
export const passwordResetApi = {
  requestCode: async (email: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  verifyCode: async (email: string, code: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/auth/verify-reset-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, code }),
    });
    return response.json();
  },

  resetPassword: async (email: string, code: string, password: string, confirmPassword: string): Promise<ApiResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.bearplus.ru/api/api'}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, code, password, confirmPassword }),
    });
    return response.json();
  }
};

// Export all APIs
export const apiService = {
  orders: ordersApi,
  documents: documentsApi,
  messages: messagesApi,
  shipping: shippingApi,
  rates: ratesApi,
  loyalty: loyaltyApi,
  margins: marginsApi,
  currency: currencyApi,
  passwordReset: passwordResetApi,
};

export default apiService;