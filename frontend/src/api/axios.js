import axios from 'axios';

const api = axios.create({
  baseURL: 'https://artisans-corner-backend-wgfm.onrender.com/api',
});

// Attach JWT token to all outgoing requests if user is logged in
api.interceptors.request.use(
  (config) => {
    try {
      const userInfo = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null;

      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    } catch (e) {
      console.error('Error reading auth token from storage:', e);
    }

    // Do NOT enforce application/json when sending FormData so the browser automatically sets multipart/form-data with correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
