import React, { useState, useEffect } from "react";
import QuickActionsNav from "./QuickActionsNav/QuickActionsNav.tsx";
import { AdminDashboardHeader } from "./AdminDashboardHeader/AdminDashboardHeader.tsx";
import { AdminDashboardStats } from "./AdminDashboardStats/AdminDashboardStats.tsx";
import PopularGenre from "./PopularGenre/PopularGenre.tsx";
import { TopDealsCard } from "./TopDealsCard/TopDealsCard.tsx";
import { fetchTopDeals, fetchDashboardStats, fetchAdminGenreStats, type TopDeal, type DashboardStats } from "../../../services/apis/adminDashboard.ts";
import styles from "./AdminPage.module.scss";

const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGames: 0,
    pendingReviews: 0,
  });
  const [genreStats, setGenreStats] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [topDeals, setTopDeals] = useState<TopDeal[]>([]);
  const [topDealsLoading, setTopDealsLoading] = useState(false);
  const [topDealsError, setTopDealsError] = useState<string | null>(null);

  const loadTopDeals = async () => {
    setTopDealsLoading(true);
    setTopDealsError(null);
    try {
      const deals = await fetchTopDeals(60, 10, "discount");
      // Defensive sorting
      deals.sort((a, b) => (b.discount_percent ?? 0) - (a.discount_percent ?? 0));
      // Defensive filtering
      const filtered = deals.filter((d) => (d.discount_percent ?? 0) >= 60).slice(0, 10);
      setTopDeals(filtered);
    } catch (e) {
      setTopDealsError("Failed to load top deals");
    } finally {
      setTopDealsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const [dashboardStats, genreStatsData] = await Promise.all([
          fetchDashboardStats(),
          fetchAdminGenreStats(),
        ]);
        console.log(genreStatsData.genre_stats)
        setStats(dashboardStats);
        setGenreStats(genreStatsData.genre_stats);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    loadTopDeals();
  }, []);

  return (
    <section className={styles.page}>
      <AdminDashboardHeader />

      <AdminDashboardStats stats={stats} isLoading={isLoading} />

      <QuickActionsNav />
      <div className={styles.chartsGrid}>
        <PopularGenre genreStats={genreStats} />
        <TopDealsCard
          deals={topDeals}
          loading={topDealsLoading}
          error={topDealsError}
          onRetry={loadTopDeals}
        />
      </div>
    </section>
  );
};

export default AdminPage;

