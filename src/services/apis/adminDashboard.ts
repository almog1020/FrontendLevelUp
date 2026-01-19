import { instance } from "./config.ts";
import { AxiosError } from "axios";
import { getAllGames, getGamesResponse, type Game } from "./games.ts";


export type TopDeal = {
  game: { id: string; title: string; image_url?: string | null };
  price: { store: string; price: number; currency: string; url: string; game_id?: string };
  discount_percent: number;
  normal_price?: number | null;
  sale_price?: number | null;
};

export interface DashboardStats {
  totalUsers: number;
  totalGames: number;
  pendingReviews: number;
}


export async function fetchUsersCount(): Promise<number> {
  try {
    
    const response = await instance.get("/users");
    
    
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

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const usersCount = await fetchUsersCount();
    // Get games count from admin endpoint which returns accurate count
    const adminGamesResponse = await fetchAdminGames(undefined, 1);
    const totalGames = adminGamesResponse.count;

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

export type GenreStatsResponse = {
  count: number;
  genre_stats: Record<string, number>;
};


export async function fetchAdminGenreStats(): Promise<GenreStatsResponse> {
  try {


    const response = await instance.get<GenreStatsResponse>("/admin/genres", {
   
    });

    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
    
      throw new Error(e.response?.data?.detail || "Failed to fetch admin genre stats");
    }
    throw e;
  }
}


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


export async function fetchAdminGames(
  q?: string,
  page_size: number = 30
): Promise<AdminGamesResponse> {


  const API_BASE_URL = instance.defaults.baseURL || "http://localhost:8000";
  const url = new URL(`${API_BASE_URL}/games`);
  if (q) url.searchParams.set("q", q);
  url.searchParams.set("page_size", String(page_size));

  const res = await fetch(url.toString(), {

  });



  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }

  return res.json();
}


export async function fetchTopDeals(
  minDiscount: number = 60,
  limit: number = 10,
  sort: "discount" | "savings" | "price" = "discount"
): Promise<TopDeal[]> {
  try {
    const response = await instance.get<{ deals: TopDeal[] }>("/admin/top-deals", {
      params: { min_discount: minDiscount, limit, sort },
    });
    return response.data.deals ?? [];
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      throw new Error(e.response?.data?.detail || "Failed to fetch top deals");
    }
    throw e;
  }
}
