import { apiClient, apiAuthClient } from "./apiClient";

<<<<<<< HEAD
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

// Re-export shared clients to keep existing imports working.
export const instance = apiClient;
export const instanceAuth = apiAuthClient;
=======
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const instance =  axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});
export const instanceAuth =  axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
    },
});
>>>>>>> origin
