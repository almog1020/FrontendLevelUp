import { instance } from "./config.ts";
import { AxiosError } from "axios";
import type { Game } from "../../interfaces/game.interface";

export interface ETLResponse {
  games_processed: number;
  prices_processed: number;
  message?: string;
}

export interface Purchase {
  id: number;
  user_id: number;
  game_id: string;
  game_title: string;
  game_image_url: string | null;
  game_genre: string | null;
  purchase_date: string;
  price: number | null;
  store: string | null;
}

export async function triggerETL(searchTerm?: string): Promise<ETLResponse> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const endpoint = '/games/etl';
    const config = {
      params: searchTerm ? { search: searchTerm } : undefined,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await instance.post(endpoint, {}, config);
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error(e.response?.data?.detail || 'Failed to trigger ETL');
    }
    throw e;
  }
}

export async function getLastPurchases(limit: number = 10): Promise<Purchase[]> {
  try {
    const token = localStorage.getItem('token');
    const response = await instance.get('/purchases/me', {
      params: { limit },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      throw new Error(e.response?.data?.detail || 'Failed to fetch purchases');
    }
    throw e;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      if (e.response?.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }
      throw new Error(e.response?.data?.detail || 'Failed to search games');
    }
    throw new Error('Failed to search games');
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




