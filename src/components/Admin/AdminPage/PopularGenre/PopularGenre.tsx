import * as React from "react";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./PopularGenre.module.scss";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"];

export interface GenreStats {
  genre: string;
  count: number;
  [key: string]: string | number;
}

interface PopularGenreProps {
  genreStats: GenreStats[];
}

const PopularGenre: React.FC<PopularGenreProps> = ({ genreStats }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!genreStats || genreStats.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Popular Genre</h3>
          <p className={styles.subtitle}>
            Game distribution by genre
          </p>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.chartContainer}>
            <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p>No data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Popular Genre</h3>
          <p className={styles.subtitle}>
            Game distribution by genre
          </p>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.chartContainer}>
            <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p>Loading chart...</p>
            </div>
          </div>
        </div>
      </div>
    );
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
                data={genreStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ genre, count }: GenreStats) => `${genre} (${count})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {genreStats.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
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
