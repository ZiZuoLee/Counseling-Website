import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string, userType: string) =>
    api.post('/auth/login', { email, password, userType }),
  signup: (name: string, email: string, password: string, userType: string, specialization?: string, level?: string) =>
    api.post('/auth/signup', { name, email, password, userType, specialization, level }),
  getProfile: () => api.get('/auth/profile'),
};

// User API
export const userAPI = {
  getUsers: () => api.get('/users'),
  getCounselors: () => api.get('/users/counselors'),
  updateStatus: (userId: string, status: string) =>
    api.patch(`/users/${userId}/status`, { status }),
  updateProfile: (userId: string, data: any) =>
    api.patch(`/users/${userId}/profile`, data),
  rateCounselor: (counselorId: string, rating: number) =>
    api.post(`/users/counselors/${counselorId}/rate`, { rating }),
};

// Appointment API
export const appointmentAPI = {
  create: (data: any) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  getById: (id: string) => api.get(`/appointments/${id}`),
  update: (id: string, data: any) => api.patch(`/appointments/${id}/status`, data),
  delete: (id: string) => api.delete(`/appointments/${id}`),
};

// Chat API
export const chatAPI = {
  create: (participantId: string) =>
    api.post('/chat', { participantId }),
  getAll: () => api.get('/chat'),
  getMessages: (chatId: string) =>
    api.get(`/chat/${chatId}/messages`),
  sendMessage: (chatId: string, content: string) =>
    api.post(`/chat/${chatId}/messages`, { content }),
};

// Hotline API
export const hotlineAPI = {
  start: (counselorId: string, emergencyDetails: string) =>
    api.post('/hotline', { counselorId, emergencyDetails }),
  end: (hotlineId: string, notes?: string) =>
    api.put(`/hotline/${hotlineId}/end`, { notes }),
  getActive: () => api.get('/hotline/active'),
  getHistory: () => api.get('/hotline/history'),
};

export default api; 