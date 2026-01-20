import { instance } from "./config.ts";
import { AxiosError } from "axios";

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




