import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import QuickActionsNav from "./QuickActionsNav/QuickActionsNav.tsx";
import StatCard from "../../UserManagement/StatCard/StatCard.tsx";
import { fetchAllUsersCount } from "../../../services/apis/adminDashboard.ts";
import { getAllGames, type Game } from "../../../services/apis/games.ts";
import styles from "./AdminPage.module.scss";
import user from "../../../assets/users.png";
import activeUser from "../../../assets/activeUsers.png";
import suspendedUsers from "../../../assets/suspendedUsers.png";
import admin from "../../../assets/admin.png";
import PopularGenre from "./PopularGenre/PopularGenre.tsx";
import type { GenreStats } from "./PopularGenre/PopularGenre.tsx";

interface Stats {
  totalUsers: number;
  totalGames: number;
  totalStores: number;
  pendingReviews: number;
}

interface WeeklyData {
  day: string;
  sales: number;
}

interface DiscountData {
  day: string;
  count: number;
}

const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalGames: 0,
    totalStores: 0,
    pendingReviews: 0,
  });
  const [games, setGames] = useState<Game[]>([]);
  const [weeklyBestsellers, setWeeklyBestsellers] = useState<WeeklyData[]>([]);
  const [topDiscounts, setTopDiscounts] = useState<DiscountData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users count
        const usersCount = await fetchAllUsersCount();

        // Fetch games from in-memory store (GET /games/)
        const gamesData = await getAllGames();
      
      
        setGames(gamesData);

        // Calculate total games
        const totalGames = gamesData.length;

        // Calculate total stores (extract unique store IDs from game IDs)
        const storeIds = new Set<string>();
        gamesData.forEach((game) => {
          // Extract store from game ID prefix (cs_, rawg_, etc.)
          if (game.id.startsWith("cs_")) storeIds.add("CheapShark");
          if (game.id.startsWith("rawg_")) storeIds.add("RAWG");
        });
        const totalStores = storeIds.size || 1; // At least 1 store

        // Update stats
        setStats({
          totalUsers: usersCount,
          totalGames,
          totalStores,
          pendingReviews: 0, // Until backend provides it
        });

        // Generate weekly bestsellers data (7 days) - placeholder for now
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const weeklyData: WeeklyData[] = days.map((day, index) => {
          // Placeholder data - can be enhanced with real sales data later
          const sales = ((index * 17 + 23) % 100) + 10;
          return { day, sales };
        });
        setWeeklyBestsellers(weeklyData);

        // Generate top discounts data - placeholder for now
        const discountData: DiscountData[] = days.map((day, index) => {
          const dayCount = Math.floor((gamesData.length / 7) + (index % 3));
          return { day, count: dayCount };
        });
        setTopDiscounts(discountData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Compute genre distribution for chart from real games data
  const genreStats = useMemo(() => {
    console.log("Computing genreStats, games.length:", games.length);
    if (games.length === 0) {
      console.log("No games, returning empty array");
      return [];
    }

    // Count games per genre, treating missing/empty genre as "Unknown"
    const genreCounts: Record<string, number> = {};
    
    games.forEach((game) => {
      const genre = game.genre?.trim() || "Unknown";
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    console.log("Genre counts:", genreCounts);

    // Convert to array and sort by count descending
    const genreArray: GenreStats[] = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    console.log("Genre array before top 5:", genreArray);

    // Take top 5 genres and merge the rest into "Other"
    if (genreArray.length <= 5) {
      console.log("Returning all genres (<=5):", genreArray);
      return genreArray;
    }

    const top5 = genreArray.slice(0, 5);
    const others = genreArray.slice(5);
    const otherCount = others.reduce((sum, item) => sum + item.count, 0);
    const result = [...top5, { genre: "Other", count: otherCount }];
    
    console.log("Final genreStats:", result);
    return result;
  }, [games]);

  const statCards = [
    {
      title: "Total Users",
      value: loading ? 0 : stats.totalUsers,
      icon: user,
    },
    {
      title: "Total Games",
      value: loading ? 0 : stats.totalGames,
      icon: activeUser,
    },
    {
      title: "Total Stores",
      value: loading ? 0 : stats.totalStores,
      icon: suspendedUsers,
    },
    {
      title: "Pending Reviews",
      value: loading ? 0 : stats.pendingReviews,
      icon: admin,
    },
  ];

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Platform overview and management</p>
        </div>
        <span className={styles.badge}>Admin Access</span>
      </header>

      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          <p>Loading dashboard data...</p>
        </div>
      )}

      <div className={styles.cardsRow}>
        {statCards.map((card, index) => (
          <StatCard key={index} title={card.title} value={card.value} icon={card.icon} />
        ))}
      </div>

      <QuickActionsNav />
      <PopularGenre genreStats={genreStats} />

      {/* Chart data is available in state but UI components not implemented yet */}
      {/* weeklyBestsellers, topDiscounts, genreStats are ready for chart rendering */}
    </section>
  );
};

export default AdminPage;

