import axios from 'axios';

// Use localhost in development, Vercel URL in production
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
    ? 'http://localhost:8000/' 
    : 'https://backend-level-up.vercel.app/';

export const instance =  axios.create({
    baseURL: baseURL,
    timeout: 30000, // Increased timeout to 30 seconds for external API calls
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});
export const instanceAuth =  axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
    },
});

