import { instance } from "./config.ts";
import { AxiosError } from "axios";
import { mockGames } from "../../data/mockGames.ts";
import type { Game } from "../../interfaces/game.interface.ts";

export interface ETLResponse {
  games_processed: number;
  prices_processed: number;
  message?: string;
}

export async function triggerETL(searchTerm?: string): Promise<ETLResponse> {
  try {
    const endpoint = '/games/etl';
    const config = searchTerm 
      ? { params: { search: searchTerm } }
      : {};
    
    const response = await instance.post(endpoint, {}, config);
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || 'Failed to trigger ETL');
    }
    throw e;
  }
}

export async function getGameById(id: string): Promise<Game | null> {
  // For now, use mock data lookup
  // TODO: Replace with actual API call when backend endpoint is available
  const game = mockGames.find(g => g.id === id);
  return game || null;
}




