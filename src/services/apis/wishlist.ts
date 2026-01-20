import { instance } from './config';
import { AxiosError } from 'axios';

export interface WishlistItem {
    id: number;
    user_id: number;
    game_id: string;
    game_title: string;
    game_image_url: string | null;
    game_price: number | null;
    game_original_price: number | null;
    game_discount: number | null;
    store_id: string | null;
    deal_id: string | null;
    added_date: string;
}

export interface WishlistCreate {
    game_id: string;
    game_title: string;
    game_image_url?: string;
    game_price?: number;
    game_original_price?: number;
    game_discount?: number;
    store_id?: string;
    deal_id?: string;
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getWishlist(): Promise<WishlistItem[]> {
    try {
        const response = await instance.get('/wishlist/', { headers: getAuthHeaders() });
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data?.detail || 'Failed to fetch wishlist');
        }
        throw e;
    }
}

export async function getWishlistIds(): Promise<string[]> {
    try {
        const response = await instance.get('/wishlist/ids', { headers: getAuthHeaders() });
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response?.status === 401) return []; // Not logged in
            throw new Error(e.response?.data?.detail || 'Failed to fetch wishlist');
        }
        throw e;
    }
}

export async function addToWishlist(data: WishlistCreate): Promise<WishlistItem> {
    try {
        const response = await instance.post('/wishlist/', data, { headers: getAuthHeaders() });
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data?.detail || 'Failed to add to wishlist');
        }
        throw e;
    }
}

export async function removeFromWishlist(gameId: string): Promise<void> {
    try {
        await instance.delete(`/wishlist/${gameId}`, { headers: getAuthHeaders() });
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.response?.data?.detail || 'Failed to remove from wishlist');
        }
        throw e;
    }
}
