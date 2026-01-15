import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

export const instance = axios.create({
    baseURL: 'http://localhost:8000', // Direct backend URL - NO proxy used
    timeout: 30000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Log request URL in development
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (import.meta.env.DEV) {
            const url = (config.baseURL || '') + (config.url || '');
            console.log(`[API] ${config.method?.toUpperCase()} ${url}`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Log status codes and handle errors
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        if (import.meta.env.DEV) {
            console.log(`[API] ✓ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
        }
        return response;
    },
    (error: AxiosError) => {
        if (import.meta.env.DEV) {
            const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
            const url = error.config?.url || 'UNKNOWN';
            const status = error.response?.status;
            const errorData = error.response?.data as { detail?: string } | undefined;
            const message = errorData?.detail || error.message;
            
            if (status) {
                console.error(`[API] ✗ ${status} ${method} ${url} - ${message}`);
            } else {
                console.error(`[API] ✗ ${method} ${url} - Network error: ${message}`);
            }
        }
        return Promise.reject(error);
    }
);
