import { instance } from "./config.ts";
import { AxiosError } from "axios";

export interface Game {
  id: string;
  title: string;
  genre?: string | null;
  image_url?: string | null;
}

export interface GamesResponse {
  games: Game[];
  total: number;
  limit: number;
}

export interface EtlResult {
  status: string;
  timestamp: string;
  games_processed: number;
  prices_processed: number;
}

/**
 * Admin game item from /admin/games endpoint
 */
export interface AdminGameItem {
  id: string;
  title: string;
  image_url?: string | null;
  store?: string | null;
  price?: number | null;
  currency?: string | null;
  deal_url?: string | null;
}

/**
 * Admin games response from /admin/games endpoint
 */
export interface AdminGamesResponse {
  items: AdminGameItem[];
  count: number;
}

/**
 * IGDB game from /games endpoint
 */
export interface IgdbGame {
  name: string;
  rating?: number | null;
  release_date?: string | null;
  genres: string[];
  image_url?: string | null;
}

/**
 * IGDB games response from /games endpoint
 */
export interface IgdbGamesResponse {
  count: number;
  games: IgdbGame[];
}

/**
 * Get games from the backend with pagination
 * @param limit - Number of games to fetch (default: 30)
 * @returns Promise<Game[]> - Array of games
 */
export async function getAllGames(limit: number = 30): Promise<Game[]> {
  try {
    const url = `/games/?limit=${limit}`;
    const response = await instance.get<GamesResponse>(url);
    
    
    const data = response.data;

    // Handle new response format: { games: Game[], total: number, limit: number }
    if (data && typeof data === "object") {
      if (Array.isArray(data.games)) {
        return data.games;
      }
      // Fallback for old format compatibility
      const dataWithItems = data as { items?: Game[] };
      if (Array.isArray(dataWithItems.items)) {
        return dataWithItems.items;
      }
    }
    // Fallback for direct array response (backward compatibility)
    if (Array.isArray(data)) {
      return data;
    }
    
    return [];
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      // If 404, try without trailing slash
      if (e.response?.status === 404) {
        try {
          const retryUrl = `/games?limit=${limit}`;
          console.log("[DEBUG] Retrying without trailing slash: http://localhost:8000" + retryUrl);
          const retryResponse = await instance.get<GamesResponse>(retryUrl);
          console.log("[DEBUG] Retry response status:", retryResponse.status);
          const retryData = retryResponse.data;
          
          if (retryData && typeof retryData === "object") {
            if (Array.isArray(retryData.games)) return retryData.games;
            const retryDataWithItems = retryData as { items?: Game[] };
            if (Array.isArray(retryDataWithItems.items)) return retryDataWithItems.items;
          }
          if (Array.isArray(retryData)) {
            return retryData;
          }
          return [];
        } catch (retryError) {
          // Fall through to throw original error
        }
      }
      throw new Error(e.response?.data?.detail || "Failed to fetch games");
    }
    throw e;
  }
}

/**
 * Get games response with pagination metadata
 * @param limit - Number of games to fetch (default: 30)
 * @returns Promise<GamesResponse> - Response with games array and metadata
 */
export async function getGamesResponse(limit: number = 30): Promise<GamesResponse> {
  try {
    const url = `/games/?limit=${limit}`;
    const response = await instance.get<GamesResponse>(url);
    
    const data = response.data;
    
    // Return the response directly if it matches the expected format
    if (data && typeof data === "object" && Array.isArray(data.games) && typeof data.total === "number") {
      return data;
    }
    
    // Fallback: construct response from array
    if (Array.isArray(data)) {
      return {
        games: data,
        total: data.length,
        limit: data.length,
      };
    }
    
    // Fallback: construct from old format
    if (data && typeof data === "object") {
      const dataWithItems = data as { games?: Game[]; items?: Game[] };
      const games = Array.isArray(dataWithItems.games) ? dataWithItems.games : 
                   Array.isArray(dataWithItems.items) ? dataWithItems.items : [];
      return {
        games,
        total: games.length,
        limit: games.length,
      };
    }
    
    return { games: [], total: 0, limit };
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 404) {
        try {
          const retryUrl = `/games?limit=${limit}`;
          const retryResponse = await instance.get<GamesResponse>(retryUrl);
          return retryResponse.data;
        } catch (retryError) {
          // Fall through
        }
      }
      throw new Error(e.response?.data?.detail || "Failed to fetch games");
    }
    throw e;
  }
}

/**
 * Fetch admin games from the backend
 * @param params - Optional parameters: q (search query) and page_size (default: 30, max: 200)
 * @returns Promise<AdminGamesResponse> - Response with items array and count
 */
export async function fetchAdminGames(params?: { q?: string; page_size?: number }): Promise<AdminGamesResponse> {
  try {
    const page_size = Math.min(params?.page_size ?? 30, 200);
    let url = `/admin/games?page_size=${page_size}`;
    
    if (params?.q) {
      url += `&q=${encodeURIComponent(params.q)}`;
    }
    
    const response = await instance.get<AdminGamesResponse>(url);
    const data = response.data;
    
    // Handle response with items array
    if (data && typeof data === "object") {
      if (Array.isArray(data.items)) {
        // If count is missing, infer from items.length
        const count = typeof data.count === "number" ? data.count : data.items.length;
        return {
          items: data.items,
          count,
        };
      }
    }
    
    // Safe fallback for malformed response
    return { items: [], count: 0 };
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || "Failed to fetch admin games");
    }
    throw e;
  }
}

/**
 * Fetch IGDB games from the backend
 * @param limit - Number of games to fetch (default: 500, max: 500)
 * @returns Promise<IgdbGamesResponse> - Response with games array and count
 */
export async function fetchIgdbGames(limit: number = 500): Promise<IgdbGamesResponse> {
  try {
    const cappedLimit = Math.min(limit, 500);
    const url = `/games/?limit=${cappedLimit}`;
    const response = await instance.get<IgdbGamesResponse>(url);
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || "Failed to fetch IGDB games");
    }
    throw e;
  }
}

export async function triggerEtl(search?: string): Promise<EtlResult> {
  try {
    const token = localStorage.getItem("access_token");
    const url = search
      ? `/games/etl?search=${encodeURIComponent(search)}`
      : "/games/etl";
    
    console.log("[DEBUG] Requested URL: http://localhost:8000" + url);

    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const response = await instance.post(url, {}, config);
    console.log("[DEBUG] ETL response status:", response.status);
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      console.error("[DEBUG] ETL error:", e.response?.status, e.response?.data);
      if (e.response?.status === 401) {
        throw new Error("Unauthorized - please login");
      }
      throw new Error(
        e.response?.data?.detail || "Failed to trigger ETL pipeline"
      );
    }
    throw e;
  }
}

// Export alias for backward compatibility with ETLTrigger component
export const triggerETL = triggerEtl;

