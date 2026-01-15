import { instance } from "./config.ts";
import { AxiosError } from "axios";
import { getAllGames, getGamesResponse, type Game } from "./games.ts";

export interface DashboardStats {
  totalUsers: number;
  totalGames: number;
  pendingReviews: number;
}

/**
 * Fetches the total count of users from the backend
 * If backend returns a list, computes count from length
 * @returns Promise<number> - Total number of users
 */
export async function fetchUsersCount(): Promise<number> {
  try {
    console.log("[DEBUG] Requested URL: http://localhost:8000/users");
    const response = await instance.get("/users");
    console.log("[DEBUG] Response status:", response.status);
    console.log("[DEBUG] Response data:", response.data);
    
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
 * @deprecated Use fetchUsersCount() instead
 */
export async function fetchAllUsersCount(): Promise<number> {
  return fetchUsersCount();
}

/**
 * Fetches the total count of games from the backend
 * Uses the total field from the response, not the array length
 * @returns Promise<number> - Total number of games
 */
export async function fetchGamesCount(): Promise<number> {
  try {
    const gamesResponse = await getGamesResponse(30);
    return gamesResponse.total;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || "Failed to fetch games count");
    }
    throw e;
  }
}

/**
 * Fetches all games and calculates dashboard statistics
 * @returns Promise<DashboardStats> - Dashboard statistics
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const usersCount = await fetchUsersCount();
    // Get games response with metadata (only 30 games, but total count)
    const gamesResponse = await getGamesResponse(30);

    // Use total from response, not array length
    const totalGames = gamesResponse.total;

    return {
      totalUsers: usersCount,
      totalGames,
      pendingReviews: 0, // Until backend provides it
    };
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || "Failed to fetch dashboard stats");
    }
    throw e;
  }
}

/**
 * Fetches games for dashboard (default: 30 games)
 * @returns Promise<Game[]> - Array of games
 */
export async function fetchDashboardGames(): Promise<Game[]> {
  try {
    return await getAllGames(30);
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || "Failed to fetch games");
    }
    throw e;
  }
}

/**
 * Genre stats response from IGDB endpoint
 */
export type GenreStatsResponse = {
  count: number;
  genre_stats: Record<string, number>;
};

/**
 * Fetches admin genre stats from the IGDB endpoint
 * This is used for the Admin Dashboard genre chart
 * @returns Promise<GenreStatsResponse> - Genre statistics with count and genre_stats
 */
export async function fetchAdminGenreStats(): Promise<GenreStatsResponse> {
  try {
    // TODO: Uncomment when tokens are implemented
    // const token = localStorage.getItem("access_token");
    // if (!token) {
    //   throw new Error("Admin access only");
    // }

    const response = await instance.get<GenreStatsResponse>("/admin/genres", {
      // TODO: Uncomment when tokens are implemented
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });

    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      // TODO: Uncomment when tokens are implemented
      // if (e.response?.status === 401 || e.response?.status === 403) {
      //   throw new Error("Admin access only");
      // }
      throw new Error(e.response?.data?.detail || "Failed to fetch admin genre stats");
    }
    throw e;
  }
}

// Admin Games Management Types and API
export type AdminGameItem = {
  id: string;
  title: string;
  image_url?: string | null;
  genres: string[];
  store?: string | null;
  price?: number | null;
  currency?: string | null;
  deal_url?: string | null;
};

export type AdminGamesResponse = {
  items: AdminGameItem[];
  count: number;
  genre_stats: Record<string, number>;
};

/**
 * Fetches admin games from the backend
 * @param q - Optional search query
 * @param page_size - Number of items per page (default: 30)
 * @returns Promise<AdminGamesResponse> - Admin games response with items, count, and genre stats
 */
export async function fetchAdminGames(
  q?: string,
  page_size: number = 30
): Promise<AdminGamesResponse> {
  // TODO: Uncomment when tokens are implemented
  // const token = localStorage.getItem("access_token");
  // if (!token) {
  //   throw new Error("Admin access only");
  // }

  const API_BASE_URL = instance.defaults.baseURL || "http://localhost:8000";
  const url = new URL(`${API_BASE_URL}/games`);
  if (q) url.searchParams.set("q", q);
  url.searchParams.set("page_size", String(page_size));

  const res = await fetch(url.toString(), {
    // TODO: Uncomment when tokens are implemented
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

  // TODO: Uncomment when tokens are implemented
  // if (res.status === 401 || res.status === 403) {
  //   throw new Error("Admin access only");
  // }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }

  return res.json();
}
