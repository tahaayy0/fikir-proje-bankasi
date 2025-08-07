import axios from 'axios';

// API base URL'ini environment variable'dan al, yoksa default değer kullan
const getApiUrl = () => {
  // Environment variable varsa onu kullan
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Render production ortamında
  if (window.location.hostname.includes('render.com') || window.location.hostname.includes('onrender.com')) {
    return 'https://fikir-proje-bankasi-backend.onrender.com/api';
  }
  
  // Local development
  return 'http://localhost:5001/api';
};

const API_BASE_URL = getApiUrl();

console.log('API Base URL:', API_BASE_URL);
console.log('Current hostname:', window.location.hostname);
console.log('Environment:', process.env.NODE_ENV);

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // CORS için credentials gönder
});

// Request interceptor - her istekte çalışır
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - her cevapta çalışır
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// API fonksiyonları
export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Test endpoint
  test: () => api.get('/test'),
  
  // Proje işlemleri
  getProjeler: () => api.get('/projeler'),
  getProje: (id) => api.get(`/projeler/${id}`),
  createProje: (data) => api.post('/projeler', data),
  updateProje: (id, data) => api.put(`/projeler/${id}`, data),
  deleteProje: (id) => api.delete(`/projeler/${id}`),
  
  // Fikir işlemleri
  createFikir: (data) => api.post('/fikirler', data),
  
  // Moderation işlemleri
  getModerationBasvurular: (params = '') => api.get(`/projeler/moderation/basvurular?${params}`),
  updateBasvuruDurum: (id, data) => api.put(`/projeler/moderation/basvurular/${id}`, data),
  
  // Oylama işlemleri
  getOylamaProjeleri: (params = '') => api.get(`/oylamalar?${params}`),
  oyVer: (id, data) => api.post(`/projeler/${id}/oy`, data),
  
  // Admin authentication işlemleri
  adminLogin: (mail, sifre) => api.post('/admin/login', { mail, sifre }),
  adminRegister: (adminData) => api.post('/admin/register', adminData),
  adminLogout: () => api.post('/admin/logout'),
  getAdminProfile: () => api.get('/admin/profile'),
  updateAdminProfile: (data) => api.put('/admin/profile', data),
  changeAdminPassword: (data) => api.put('/admin/change-password', data),
  
  // Token yönetimi
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api; 