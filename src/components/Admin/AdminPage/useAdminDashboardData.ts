import { useEffect, useState } from "react";
import { fetchDashboardStats, fetchAdminGenreStats } from "../../../services/apis/adminDashboard.ts";
import type { Game } from "../../../services/apis/games.ts";
import type { DashboardStats } from "../../../services/apis/adminDashboard.ts";

export interface UseAdminDashboardDataReturn {
  stats: DashboardStats;
  games: Game[];
  genreStats: Record<string, number> | null;
  isLoading: boolean;
  error: string | null;
}

export function useAdminDashboardData(): UseAdminDashboardDataReturn {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGames: 0,
    pendingReviews: 0,
  });
  const [genreStats, setGenreStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dashboardStats, genreStatsData] = await Promise.all([
          fetchDashboardStats(),
          fetchAdminGenreStats(),
        ]);

        setStats(dashboardStats);
        setGenreStats(genreStatsData.genre_stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    stats,
    games: [], // Games are not needed for dashboard - Game Management handles its own games
    genreStats,
    isLoading: loading,
    error,
  };
}

