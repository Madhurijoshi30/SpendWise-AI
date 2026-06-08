import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the 401 error is coming from the actual login request endpoint
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      // Only remove token and redirect if they are NOT trying to log in right now
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Always pass the error through so Login.tsx can catch it!
    return Promise.reject(error);
  }
);


// Auth API
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getMe: () => api.get('/auth/me'),
};

// Expense API
export const expenseAPI = {
  parseExpense: (text: string) => api.post('/expenses/parse', { text }),

  getExpenses: (filters?: { category?: string; startDate?: string; endDate?: string; search?: string }) =>
    api.get('/expenses', { params: filters }),

  getStats: () => api.get('/expenses/stats'),

  updateExpense: (id: string, data: { amount?: number; category?: string; description?: string; date?: string }) =>
    api.put(`/expenses/${id}`, data),

  deleteExpense: (id: string) => api.delete(`/expenses/${id}`),
};

export default api;
