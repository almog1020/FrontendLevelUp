import StatCard from "../../../UserManagement/StatCard/StatCard.tsx";
import styles from "../AdminPage.module.scss";
import user from "../../../../assets/users.png";
import activeUser from "../../../../assets/activeUsers.png";
import suspendedUsers from "../../../../assets/suspendedUsers.png";
import admin from "../../../../assets/admin.png";
import type { DashboardStats } from "../../../../services/apis/adminDashboard.ts";

interface AdminDashboardStatsProps {
  stats: DashboardStats;
  isLoading: boolean;
}

export function AdminDashboardStats({ stats, isLoading }: AdminDashboardStatsProps) {
  const statCards = [
    {
      title: "Total Users",
      value: isLoading ? 0 : stats.totalUsers,
      icon: user,
    },
    {
      title: "Total Games",
      value: isLoading ? 0 : stats.totalGames,
      icon: activeUser,
    },
    {
      title: "Pending Reviews",
      value: isLoading ? 0 : stats.pendingReviews,
      icon: admin,
    },
  ];

  return (
    <div className={styles.cardsRow}>
      {statCards.map((card, index) => (
        <StatCard key={index} title={card.title} value={card.value} icon={card.icon} />
      ))}
    </div>
  );
}

