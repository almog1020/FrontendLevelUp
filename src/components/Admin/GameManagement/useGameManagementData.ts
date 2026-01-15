import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchAdminGames } from "../../../services/apis/games";
import type { AdminGameItem } from "../../../services/apis/games";
import { toast } from "react-toastify";

export interface UseGameManagementDataReturn {
  items: AdminGameItem[];
  count: number;
  isLoading: boolean;
  error: string | null;
  filterText: string;
  setFilterText: (value: string) => void;
  refreshGames: () => Promise<void>;
}

export function useGameManagementData(): UseGameManagementDataReturn {
  const [items, setItems] = useState<AdminGameItem[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>("");

  const load = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch games from /admin/games endpoint with server-side search
      const response = await fetchAdminGames({
        q: q.trim() || undefined,
        page_size: 30,
      });

      setItems(response.items);
      setCount(response.count);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      setError(msg);
      setItems([]);
      setCount(0);
      // Only show toast for non-auth errors (auth errors will be shown in UI)
      if (msg !== "Admin access only") {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => load(filterText || ""), 300);
    return () => clearTimeout(t);
  }, [filterText, load]);

  const refreshGames = useCallback(() => load(filterText || ""), [load, filterText]);

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

