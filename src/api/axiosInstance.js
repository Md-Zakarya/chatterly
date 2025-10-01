import axios from 'axios';
import { BASE_URL } from './endpoints';

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Default base URL
    timeout: 10000, // Increased timeout for search operations
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;