import axios from 'axios';

export const instance =  axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 10000, // 10 seconds
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});
export const instanceAuth =  axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 10000, // 10 seconds
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});

// Add request interceptor to include authentication token
instanceAuth.interceptors.request.use(
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