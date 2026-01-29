import { apiClient, apiAuthClient } from "./apiClient";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

// Re-export shared clients to keep existing imports working.
export const instance = apiClient;
export const instanceAuth = apiAuthClient;
