import { instance } from "./config.ts";
import { AxiosError } from "axios";

/**
 * Fetches the total count of users from the backend
 * @returns Promise<number> - Total number of users
 */
export async function fetchAllUsersCount(): Promise<number> {
  try {
    const response = await instance.get("/users");
    const data = response.data;

    // Handle different response shapes
    if (Array.isArray(data)) {
      return data.length;
    }
    if (data && typeof data === "object") {
      // Handle {items: []} or {users: []} patterns
      if (Array.isArray(data.items)) {
        return data.items.length;
      }
      if (Array.isArray(data.users)) {
        return data.users.length;
      }
      if (typeof data.count === "number") {
        return data.count;
      }
    }
    return 0;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || "Failed to fetch users count");
    }
    throw e;
  }
}

/**
 * Triggers the games ETL process and fetches game data
 * @param search - Optional search query parameter
 * @returns Promise<any[]> - Array of games from the response
 */
export async function triggerGamesEtl(search?: string): Promise<any[]> {
  try {
    const url = search ? `/games/etl?search=${encodeURIComponent(search)}` : "/games/etl";
    const response = await instance.post(url);
    const data = response.data;

    // Handle different response shapes
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === "object") {
      // Handle {games: []} or {items: []} patterns
      if (Array.isArray(data.games)) {
        return data.games;
      }
      if (Array.isArray(data.items)) {
        return data.items;
      }
      if (Array.isArray(data.data)) {
        return data.data;
      }
    }
    return [];
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || "Failed to trigger games ETL");
    }
    throw e;
  }
}

