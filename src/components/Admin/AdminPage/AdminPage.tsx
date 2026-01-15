import QuickActionsNav from "./QuickActionsNav/QuickActionsNav.tsx";
import { AdminDashboardHeader } from "./AdminDashboardHeader/AdminDashboardHeader.tsx";
import { AdminDashboardStats } from "./AdminDashboardStats/AdminDashboardStats.tsx";
import { AdminDashboardCharts } from "./AdminDashboardCharts/AdminDashboardCharts.tsx";
import { useAdminDashboardData } from "./useAdminDashboardData.ts";
import styles from "./AdminPage.module.scss";

const AdminPage: React.FC = () => {
  const { stats, genreStats, isLoading, error } = useAdminDashboardData();

  return (
    <section className={styles.page}>
      <AdminDashboardHeader />

      {error && (
        <div className={styles.error}>
          <p>Error: {error}</p>
        </div>
      )}

      {isLoading && (
        <div className={styles.loading}>
          <p>Loading dashboard data...</p>
        </div>
      )}

      <AdminDashboardStats stats={stats} isLoading={isLoading} />

      <QuickActionsNav />
      <AdminDashboardCharts genreStats={genreStats} />
    </section>
  );
};

export default AdminPage;

