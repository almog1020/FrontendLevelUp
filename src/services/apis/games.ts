import { instance } from "./config.ts";
import { AxiosError } from "axios";
import type { Game as FullGame } from "../../interfaces/game.interface";

// Simple game interface for API responses (different from full Game interface)
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
 * Recent purchase record for user dashboard
 */
export interface Purchase {
  game_id: string;
  game_title: string;
  game_genre?: string | null;
  game_image_url?: string | null;
  purchased_at?: string | null;
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
    const response = await instance.get(url);
    
    const data = response.data;
    
    // Backend returns { count: number, games: Game[] }
    // We need to map it to { games: Game[], total: number, limit: number }
    if (data && typeof data === "object") {
      // Handle backend format: { count: number, games: Game[] }
      if (Array.isArray(data.games) && typeof data.count === "number") {
        return {
          games: data.games,
          total: data.count, // Use count from backend
          limit: data.games.length,
        };
      }
      // Handle GamesResponse format: { games: Game[], total: number, limit: number }
      if (Array.isArray(data.games) && typeof data.total === "number") {
        return data as GamesResponse;
      }
      // Fallback: construct from items array
      const dataWithItems = data as { games?: Game[]; items?: Game[]; count?: number };
      const games = Array.isArray(dataWithItems.games) ? dataWithItems.games : 
                   Array.isArray(dataWithItems.items) ? dataWithItems.items : [];
      return {
        games,
        total: typeof dataWithItems.count === "number" ? dataWithItems.count : games.length,
        limit: games.length,
      };
    }
    
    // Fallback: construct response from array
    if (Array.isArray(data)) {
      return {
        games: data,
        total: data.length,
        limit: data.length,
      };
    }
    
    return { games: [], total: 0, limit };
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 404) {
        try {
          const retryUrl = `/games?limit=${limit}`;
          const retryResponse = await instance.get(retryUrl);
          const retryData = retryResponse.data;
          // Handle same format mapping
          if (retryData && typeof retryData === "object" && Array.isArray(retryData.games)) {
            return {
              games: retryData.games,
              total: typeof retryData.count === "number" ? retryData.count : 
                     typeof retryData.total === "number" ? retryData.total : 
                     retryData.games.length,
              limit: retryData.games.length,
            };
          }
          return retryData as GamesResponse;
        } catch (retryError) {
          // Fall through
        }
      }
      const errorMessage = e.response?.data?.detail || `Failed to fetch games from /games/?limit=${limit}`;
      console.error(`[getGamesResponse] Error: ${errorMessage}`, {
        endpoint: `/games/?limit=${limit}`,
        status: e.response?.status,
      });
      throw new Error(errorMessage);
    }
    throw e;
  }
}

export async function getTrendingGames(): Promise<FullGame[]> {
  try {
    const response = await instance.get<FullGame[]>('/games/trending');
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || e.message || 'Failed to fetch trending games');
    }
    throw e;
  }
}

export async function getDealOfTheDay(): Promise<FullGame | null> {
  try {
    const response = await instance.get<FullGame>('/games/deal-of-the-day');
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 404) {
        return null;
      }
      throw new Error(e.response?.data?.detail || e.message || 'Failed to fetch deal of the day');
    }
    throw e;
  }
}

export async function searchGames(query: string): Promise<FullGame[]> {
  try {
    if (!query || !query.trim()) {
      return [];
    }
    const response = await instance.get<FullGame[]>('/games/search', {
      params: { q: query.trim() }
    });
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || 'Failed to search games');
    }
    throw e;
  }
}

export async function getGameById(id: string): Promise<FullGame | null> {
  try {
    const response = await instance.get<FullGame>(`/games/${id}`);
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 404) {
        return null;
      }
      throw new Error(e.response?.data?.detail || 'Failed to fetch game');
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

/**
 * Fetch user's last purchases
 * @param limit - Number of purchases to fetch (default: 10)
 */
export async function getLastPurchases(limit: number = 10): Promise<Purchase[]> {
  const tryUrls = [
    `/users/purchases?limit=${limit}`,
    `/users/last-purchases?limit=${limit}`,
  ];

  const normalizePurchases = (data: unknown): Purchase[] => {
    if (Array.isArray(data)) {
      return data as Purchase[];
    }
    if (data && typeof data === "object") {
      const asObj = data as { purchases?: Purchase[]; items?: Purchase[] };
      if (Array.isArray(asObj.purchases)) return asObj.purchases;
      if (Array.isArray(asObj.items)) return asObj.items;
    }
    return [];
  };

  for (const url of tryUrls) {
    try {
      const response = await instance.get(url);
      return normalizePurchases(response.data);
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response?.status === 404) {
        continue;
      }
      if (e instanceof AxiosError) {
        throw new Error(e.response?.data?.detail || "Failed to fetch purchases");
      }
      throw e;
    }
  }

  throw new Error("Purchases endpoint not found");
}