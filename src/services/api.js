// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_URL_BACKEND_API
});

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

api.interceptors.response.use(
    response => response,
    error => {
        // Solo redirigir si es error de autenticación y no estamos en login
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;