import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { WishlistGame, WishlistGameInput, WishlistItem } from "../interfaces/wishlist.interface";
import { addToWishlist, getWishlist, removeFromWishlist, WishlistAuthError } from "../services/apis/wishlist";
import {useCookies} from "react-cookie";

interface WishlistContextValue {
  wishlistSet: Set<string>;
  wishlistGames: WishlistGame[];
  isWishlistLoading: boolean;
  pendingGameIds: Set<string>;
  isWishlistLoaded: boolean;
  refreshWishlist: () => Promise<void>;
  toggleWishlist: (gameId: string, snapshot?: { title?: string; thumb?: string | null }) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const mapWishlistItem = (item: WishlistItem): WishlistGame | null => {
  const externalId = item.external_game_id ?? item.game_id;
  if (!externalId) return null;
  const title = item.title ?? "Unknown title";
  return {
    id: externalId,
    title,
    image: item.thumb ?? null,
    createdAt: item.created_at,
  };
};
const mapSnapshot = (input: WishlistGameInput): WishlistGame => ({
  id: input.id,
  title: input.title ?? "Unknown title",
  image: input.image ?? null,
  createdAt: input.createdAt,
});

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlistGames, setWishlistGames] = useState<WishlistGame[]>([]);
  const [wishlistSet, setWishlistSet] = useState<Set<string>>(new Set());
  const [isWishlistLoading, setIsWishlistLoading] = useState<boolean>(false);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState<boolean>(false);
  const [pendingGameIds, setPendingGameIds] = useState<Set<string>>(new Set());
  const cacheRef = useRef<Map<string, WishlistGame>>(new Map());
  const [cookies] = useCookies();
  const refreshWishlist = useCallback(async () => {
    if (!cookies.access_token) {
      setWishlistGames([]);
      setWishlistSet(new Set());
      setIsWishlistLoaded(true);
      return;
    }

    setIsWishlistLoading(true);
    try {
      const items = await getWishlist();
      const mapped: WishlistGame[] = [];

      items.forEach((item: WishlistItem) => {
        const externalId = item.external_game_id ?? item.game_id;
        if (!externalId) return;
        const cached = cacheRef.current.get(externalId);
        if (cached) {
          mapped.push(cached);
          return;
        }
        const mappedItem = mapWishlistItem(item);
        if (mappedItem) {
          mapped.push(mappedItem);
          cacheRef.current.set(mappedItem.id, mappedItem);
        }
      });

      const unique = new Map(mapped.map((game) => [game.id, game]));
      const games = Array.from(unique.values());
      setWishlistGames(games);
      setWishlistSet(new Set(games.map((g) => g.id)));
    } catch (err) {
      if (err instanceof WishlistAuthError) {
        setWishlistGames([]);
        setWishlistSet(new Set());
      }
      console.error("Failed to refresh wishlist:", err);
    } finally {
      setIsWishlistLoading(false);
      setIsWishlistLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (cookies.access_token) {
      refreshWishlist();
    } else {
      setIsWishlistLoaded(true);
    }
  }, [refreshWishlist]);

  const toggleWishlist = useCallback(async (gameId: string, snapshot?: { title?: string; thumb?: string | null }) => {
    if (!cookies.access_token) {
      throw new WishlistAuthError("Please sign in to use your wishlist.");
    }

    setPendingGameIds((prev) => new Set(prev).add(gameId));
    const wasWishlisted = wishlistSet.has(gameId);
    const prevGames = wishlistGames;
    const prevSet = wishlistSet;

    if (wasWishlisted) {
      setWishlistSet((prev) => {
        const next = new Set(prev);
        next.delete(gameId);
        return next;
      });
      setWishlistGames((prev) => prev.filter((g) => g.id !== gameId));
    } else {
      setWishlistSet((prev) => new Set(prev).add(gameId));
      const cached = cacheRef.current.get(gameId);
      const optimistic = cached ?? mapSnapshot({ id: gameId, title: snapshot?.title, image: snapshot?.thumb ?? null });
      cacheRef.current.set(gameId, optimistic);
      setWishlistGames((prev) => {
        const next = new Map(prev.map((g) => [g.id, g]));
        next.set(optimistic.id, optimistic);
        return Array.from(next.values());
      });
    }

    try {
      if (wasWishlisted) {
        await removeFromWishlist(gameId);
      } else {
        await addToWishlist(gameId, snapshot);
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      setWishlistGames(prevGames);
      setWishlistSet(prevSet);
      throw err;
    } finally {
      setPendingGameIds((prev) => {
        const next = new Set(prev);
        next.delete(gameId);
        return next;
      });
    }
  }, [wishlistGames, wishlistSet]);

  const value = useMemo(
    () => ({
      wishlistSet,
      wishlistGames,
      isWishlistLoading,
      pendingGameIds,
      isWishlistLoaded,
      refreshWishlist,
      toggleWishlist,
    }),
    [wishlistSet, wishlistGames, isWishlistLoading, pendingGameIds, isWishlistLoaded, refreshWishlist, toggleWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
