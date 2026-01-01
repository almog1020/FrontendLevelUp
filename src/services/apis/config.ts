import axios from 'axios';

export const instance = axios.create({
    baseURL: '/api', // Use relative path - Vite proxy will handle routing to backend
    timeout: 10000, // Increased timeout to 10 seconds
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});
