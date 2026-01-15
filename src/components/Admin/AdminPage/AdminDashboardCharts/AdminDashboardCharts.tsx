import PopularGenre from "../PopularGenre/PopularGenre.tsx";

interface AdminDashboardChartsProps {
  genreStats: Record<string, number> | null | undefined;
}

export function AdminDashboardCharts({ genreStats }: AdminDashboardChartsProps) {
  return <PopularGenre genreStats={genreStats} />;
}

