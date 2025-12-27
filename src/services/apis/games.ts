import { instance } from "./config.ts";
import { AxiosError } from "axios";

export interface ETLResponse {
  games_processed: number;
  prices_processed: number;
  message?: string;
}

export async function triggerETL(searchTerm?: string): Promise<ETLResponse> {
  try {
    const endpoint = searchTerm ? '/etl/trigger' : '/etl/trigger';
    const payload = searchTerm ? { search_term: searchTerm } : {};
    
    const response = await instance.post(endpoint, payload);
    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || 'Failed to trigger ETL');
    }
    throw e;
  }
}

