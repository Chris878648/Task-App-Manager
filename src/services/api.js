import axios from "axios";

const API_BASE_URL = "https://taskappback-7lg5.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// El resto de tu código se mantiene igual
api.interceptors.request.use(
  async (config) => {
    console.log('Entering request interceptor');
    const token = await localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Returning interceptor config:', config);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

export default api;
