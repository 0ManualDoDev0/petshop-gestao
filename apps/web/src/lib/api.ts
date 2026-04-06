import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Injetar token automaticamente em toda requisição
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh do token se expirado
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================
// API HELPERS por domínio
// ============================================================

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
};

export const dashboardApi = {
  getKPIs: () => api.get('/dashboard/kpis').then(r => r.data),
};

export const appointmentsApi = {
  getAll: (params?: any) => api.get('/appointments', { params }).then(r => r.data),
  getToday: () => api.get('/appointments/today').then(r => r.data),
  getAvailableSlots: (params: any) => api.get('/appointments/available-slots', { params }).then(r => r.data),
  create: (data: any) => api.post('/appointments', data).then(r => r.data),
  start: (id: string) => api.patch(`/appointments/${id}/start`).then(r => r.data),
  complete: (id: string, data: any) => api.patch(`/appointments/${id}/complete`, data).then(r => r.data),
  cancel: (id: string, reason: string) => api.patch(`/appointments/${id}/cancel`, { reason }).then(r => r.data),
};

export const clientsApi = {
  getAll: (params?: any) => api.get('/clients', { params }).then(r => r.data),
  getById: (id: string) => api.get(`/clients/${id}`).then(r => r.data),
  create: (data: any) => api.post('/clients', data).then(r => r.data),
  update: (id: string, data: any) => api.put(`/clients/${id}`, data).then(r => r.data),
  search: (q: string) => api.get('/clients/search', { params: { q } }).then(r => r.data),
};

export const petsApi = {
  getByClient: (clientId: string) => api.get(`/pets`, { params: { clientId } }).then(r => r.data),
  create: (data: any) => api.post('/pets', data).then(r => r.data),
};

export const servicesApi = {
  getAll: () => api.get('/services').then(r => r.data),
};

export const financeApi = {
  getSummary: (start: string, end: string) => api.get('/finance/summary', { params: { start, end } }).then(r => r.data),
  getDailyClose: (date?: string) => api.get('/finance/daily-close', { params: { date } }).then(r => r.data),
  getByEmployee: (start: string, end: string) => api.get('/finance/by-employee', { params: { start, end } }).then(r => r.data),
  getCashEntries: (params?: any) => api.get('/finance/cash-entries', { params }).then(r => r.data),
  createEntry: (data: any) => api.post('/finance/cash-entries', data).then(r => r.data),
};

export const hotelApi = {
  getActive: () => api.get('/hotel/active').then(r => r.data),
  checkIn: (data: any) => api.post('/hotel/check-in', data).then(r => r.data),
  checkOut: (id: string) => api.patch(`/hotel/${id}/check-out`).then(r => r.data),
};

export const usersApi = {
  getAll: () => api.get('/users').then(r => r.data),
};
