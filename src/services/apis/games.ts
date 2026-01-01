import { instance } from "./config.ts";
import { AxiosError } from "axios";

export interface Game {
  id: string;
  title: string;
  genre?: string | null;
  image_url?: string | null;
}

export interface EtlResult {
  status: string;
  timestamp: string;
  games_processed: number;
  prices_processed: number;
}

/**
 * Get all games from the in-memory database
 * @returns Promise<Game[]> - Array of games
 */
export async function getAllGames(): Promise<Game[]> {
  try {
    console.log("Fetching games from /games/");
    const response = await instance.get("/games/");
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    const data = response.data;

    // Handle different response shapes
    if (Array.isArray(data)) {
      console.log("Returning array of games, count:", data.length);
      return data;
    }
    if (data && typeof data === "object") {
      if (Array.isArray(data.games)) {
        console.log("Returning data.games, count:", data.games.length);
        return data.games;
      }
      if (Array.isArray(data.items)) {
        console.log("Returning data.items, count:", data.items.length);
        return data.items;
      }
    }
    console.log("No games found, returning empty array");
    return [];
  } catch (e: unknown) {
    console.error("Error fetching games:", e);
    if (e instanceof AxiosError) {
      console.error("Axios error details:", e.response?.data);
      throw new Error(e.response?.data?.detail || "Failed to fetch games");
    }
    throw e;
  }
}

/**
 * Trigger ETL pipeline to fetch game data from external APIs
 * @param search - Optional search term to filter games
 * @returns Promise<EtlResult> - ETL result summary
 */
/**
 * Trigger ETL pipeline to fetch game data from external APIs
 * @param search - Optional search term to filter games
 * @returns Promise<EtlResult> - ETL result summary
 */
export async function triggerEtl(search?: string): Promise<EtlResult> {
  try {
    // Get token from localStorage - using access_token as standard key
    // If your project uses a different key, update this line
    const token = localStorage.getItem("access_token");

    const url = search
      ? `/games/etl?search=${encodeURIComponent(search)}`
      : "/games/etl";

    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const response = await instance.post(url, {}, config);
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
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

