import styles from "../GameManagement.module.scss";

interface GameManagementEmptyStateProps {
  hasGames: boolean;
}

export function GameManagementEmptyState({ hasGames }: GameManagementEmptyStateProps) {
  return (
    <div className={styles.empty}>
      {hasGames
        ? "No games match the filter."
        : "No games found."}
    </div>
  );
}

