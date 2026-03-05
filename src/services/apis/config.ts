import { apiClient, apiAuthClient, API_BASE_URL } from "./apiClient";

export { API_BASE_URL };
export const instance = apiClient;
export const instanceAuth = apiAuthClient;