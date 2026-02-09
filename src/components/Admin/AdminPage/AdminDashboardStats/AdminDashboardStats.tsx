import StatCard from "../../../General/StatCard/StatCard.tsx";
import styles from "../AdminPage.module.scss";
import user from "../../../../assets/users.png";
import gameIcon from "../../../../assets/game.png";
import type { DashboardStats } from "../../../../services/apis/adminDashboard.ts";
import reviewIcon from "../../../../assets/review.png";

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
      icon: gameIcon,
    },
    {
      title: "Reviews",
      value: isLoading ? 0 : stats.pendingReviews,
      icon: reviewIcon,
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

