import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: false,
});

api.interceptors.request.use(
    async (config) => {
        console.log('Entering request interceptor');
        const token =  await localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } console.log('Returning interceptor config:', config);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

export default api;