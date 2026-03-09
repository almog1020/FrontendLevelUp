import { AxiosError } from "axios";
import { instanceAuth } from "./config";
import type { WishlistItem } from "../../interfaces/wishlist.interface";

export class WishlistAuthError extends Error {
  code = "auth";
}

const normalizeError = (e: unknown): Error => {
  if (e instanceof AxiosError) {
    if (e.response?.status === 401) {
      return new WishlistAuthError("Please sign in to use your wishlist.");
    }
    if (e.response?.status === 422) {
      const detail = e.response?.data?.detail;
      const message =
        Array.isArray(detail) && detail.length > 0 && detail[0]?.msg
          ? detail[0].msg
          : "Invalid wishlist payload";
      console.error("Wishlist 422:", e.response?.status, e.response?.data);
      return new Error(message);
    }
    if (e.response?.status === 409) {
      return new Error("Already in wishlist");
    }
    console.error("Wishlist error:", e.response?.status, e.response?.data);
    return new Error(e.response?.data?.detail || "Wishlist request failed");
  }
  return e instanceof Error ? e : new Error("Wishlist request failed");
};

export async function getWishlist(): Promise<WishlistItem[]> {
  try {
    const response = await instanceAuth.get<WishlistItem[]>("/wishlist");
    return response.data;
  } catch (e: unknown) {
    throw normalizeError(e);
  }
}

export async function addToWishlist(
  gameId: string,
  snapshot?: { title?: string; thumb?: string | null }
): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    // Backend expects JSON body: { game_id }.
    await instanceAuth.post(
      "/wishlist",
      {
        game_id: gameId,
        ...(snapshot?.title ? { title: snapshot.title } : {}),
        ...(snapshot?.thumb ? { thumb: snapshot.thumb } : {}),
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
  } catch (e: unknown) {
    const normalized = normalizeError(e);
    if (normalized.message === "Already in wishlist") {
      return;
    }
    throw normalized;
  }
}

export async function removeFromWishlist(gameId: string): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    await instanceAuth.delete(`/wishlist/${encodeURIComponent(gameId)}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (e: unknown) {
    throw normalizeError(e);
  }
}
