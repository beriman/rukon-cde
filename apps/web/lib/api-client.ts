import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// Create Axios instance
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
    (config) => {
        // We need to access the store outside of a component
        // Zustand stores can be used directly
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;

        if (response && response.status === 401) {
            // Token expired or invalid
            useAuthStore.getState().logout();
            // Optionally redirect to login, but the UI should react to state change usually
            // window.location.href = '/auth/login'; 
        }

        return Promise.reject(error);
    }
);
