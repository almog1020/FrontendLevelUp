import * as React from "react";
import styles from "./PopularGenre.module.scss";

export function PopularGenreEmptyState() {
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
          <div className={styles.emptyChartContainer}>
            <p>No data available</p>
          </div>
        </div>
      </div>
    </div>
  );
}

