import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchIgdbGames } from "../../../services/apis/games";
import type { IgdbGame } from "../../../services/apis/games";
import { toast } from "react-toastify";

export interface UseGameManagementDataReturn {
  items: IgdbGame[];
  count: number;
  isLoading: boolean;
  error: string | null;
  filterText: string;
  setFilterText: (value: string) => void;
  refreshGames: () => Promise<void>;
}

export function useGameManagementData(): UseGameManagementDataReturn {
  const [allItems, setAllItems] = useState<IgdbGame[]>([]);
  const [items, setItems] = useState<IgdbGame[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>("");

  // Client-side filtering function
  const applyFilter = useCallback((games: IgdbGame[], searchText: string): IgdbGame[] => {
    if (!searchText.trim()) {
      return games;
    }

    const lowerSearch = searchText.toLowerCase().trim();
    return games.filter((game) => {
      // Filter by name (case-insensitive)
      if (game.name.toLowerCase().includes(lowerSearch)) {
        return true;
      }
      // Filter by genres (case-insensitive)
      if (game.genres && Array.isArray(game.genres)) {
        return game.genres.some((genre) => genre.toLowerCase().includes(lowerSearch));
      }
      return false;
    });
  }, []);

  // Load games from server
  const loadFromServer = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchIgdbGames(500);
      setAllItems(response.games);
      setCount(response.count ?? response.games.length);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load games";
      setError(msg);
      setAllItems([]);
      setItems([]);
      setCount(0);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadFromServer();
  }, []); // Only run on mount

  // Client-side filtering when filterText changes
  useEffect(() => {
    const filtered = applyFilter(allItems, filterText);
    setItems(filtered);
  }, [filterText, allItems, applyFilter]);

  const refreshGames = useCallback(async () => {
    await loadFromServer();
  }, [loadFromServer]);

  return useMemo(
    () => ({
      items,
      count,
      isLoading: loading,
      error,
      filterText,
      setFilterText,
      refreshGames,
    }),
    [items, count, loading, error, filterText, refreshGames]
  );
}

