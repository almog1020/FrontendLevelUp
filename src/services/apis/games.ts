import { instance } from "./config.ts";
import { AxiosError } from "axios";
import type { Game } from "../../interfaces/game.interface";

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

export async function getAllGames(): Promise<Game[]> {
  try {
    const response = await instance.get<Game[]>('/games/');
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || 'Failed to fetch games');
    }
    throw e;
  }
}

export async function getTrendingGames(): Promise<Game[]> {
  try {
    const response = await instance.get<Game[]>('/games/trending');
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || e.message || 'Failed to fetch trending games');
    }
    throw e;
  }
}

export async function getDealOfTheDay(): Promise<Game | null> {
  try {
    const response = await instance.get<Game>('/games/deal-of-the-day');
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

export async function searchGames(query: string): Promise<Game[]> {
  try {
    if (!query || !query.trim()) {
      return [];
    }
    const response = await instance.get<Game[]>('/games/search', {
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

export async function getGameById(id: string): Promise<Game | null> {
  try {
    const response = await instance.get<Game>(`/games/${id}`);
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




