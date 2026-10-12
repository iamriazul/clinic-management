import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get CSRF token from cookie
function getCsrfToken() {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return '';
}

// Add CSRF token to every mutating request
api.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    config.headers['X-CSRFToken'] = getCsrfToken();
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  logout: () => api.post('/auth/logout/'),
  getMe: () => api.get('/auth/me/'),
  getCsrf: () => api.get('/auth/csrf/'),
};

// Doctor API
export const doctorAPI = {
  list: () => api.get('/doctors/'),
  get: (id) => api.get(`/doctors/${id}/`),
  create: (data) => api.post('/doctors/', data),
  update: (id, data) => api.put(`/doctors/${id}/`, data),
  delete: (id) => api.delete(`/doctors/${id}/`),
};

// Patient API
export const patientAPI = {
  list: (search = '') => api.get(`/patients/${search ? `?search=${search}` : ''}`),
  get: (id) => api.get(`/patients/${id}/`),
  create: (data) => api.post('/patients/', data),
  update: (id, data) => api.patch(`/patients/${id}/`, data),
};

// Appointment API
export const appointmentAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/appointments/${query ? `?${query}` : ''}`);
  },
  get: (id) => api.get(`/appointments/${id}/`),
  create: (data) => api.post('/appointments/', data),
  update: (id, data) => api.patch(`/appointments/${id}/`, data),
  delete: (id) => api.delete(`/appointments/${id}/`),
  getSlots: (doctorId, date) => api.get(`/appointments/slots/?doctor=${doctorId}&date=${date}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats/'),
};

export default api;
