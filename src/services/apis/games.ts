import { instance } from "./config.ts";
import { AxiosError } from "axios";

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




