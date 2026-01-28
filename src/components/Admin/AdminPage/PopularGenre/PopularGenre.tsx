import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./PopularGenre.module.scss";
import { PopularGenreEmptyState } from "./PopularGenreEmptyState";
import { PopularGenreLoadingState } from "./PopularGenreLoadingState";
import { getGenreColor } from "./genreColorUtils";

// Legacy interface for array format (kept for backward compatibility if needed)
export interface GenreStats {
  genre: string;
  count: number;
  [key: string]: string | number;
}

interface PopularGenreProps {
  genreStats: Record<string, number> | null | undefined;
}

const PopularGenre: React.FC<PopularGenreProps> = ({ genreStats }) => {
  // If genreStats is null or undefined, show loading
  if (genreStats == null) {
    return <PopularGenreLoadingState />;
  }

  // If genreStats exists but has no keys, show empty
  if (Object.keys(genreStats).length === 0) {
    return <PopularGenreEmptyState />;
  }

  // Convert object to array for rendering
  const entries = Object.entries(genreStats);
  
  // Sort by count descending and take top 5
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5);
  
  // If there are more than 5, merge the rest into "Other"
  let chartData: Array<{ genre: string; count: number }>;
  if (sorted.length > 5) {
    const others = sorted.slice(5);
    const otherCount = others.reduce((sum, [, count]) => sum + count, 0);
    chartData = [
      ...top.map(([genre, count]) => ({ genre, count })),
      { genre: "Other", count: otherCount },
    ];
  } else {
    chartData = top.map(([genre, count]) => ({ genre, count }));
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Popular Games</h3>
        <p className={styles.subtitle}>
          Game distribution by genre
        </p>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.chartContainer} style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => {
                  const { genre, count } = props;
                  return `${genre} (${count})`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.map((item) => (
                  <Cell
                    key={`cell-${item.genre}`}
                    fill={getGenreColor(item.genre)}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PopularGenre;
