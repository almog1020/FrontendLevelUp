import React from "react";
import { GameManagementHeader } from "./GameManagementHeader/GameManagementHeader.tsx";
import { GameFilters } from "./GameFilters/GameFilters.tsx";
import { GamesTable } from "./GamesTable/GamesTable.tsx";
import { GameManagementLoadingState } from "./GameManagementLoadingState/GameManagementLoadingState.tsx";
import { GameManagementEmptyState } from "./GameManagementEmptyState/GameManagementEmptyState.tsx";
import { useGameManagementData } from "./useGameManagementData.ts";
import styles from "./GameManagement.module.scss";

const GameManagement: React.FC = () => {
  const {
    items,
    count,
    isLoading,
    error,
    filterText,
    setFilterText,
    refreshGames,
  } = useGameManagementData();

  // Handle error state
  if (error === "Admin access only") {
    return (
      <section className={styles.page}>
        <GameManagementHeader />
        <div className={styles.section}>
          <div className={styles.error}>
            <strong>Admin access only</strong>
            <p>Please sign in with admin credentials to access this page.</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.page}>
        <GameManagementHeader />
        <div className={styles.section}>
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <GameManagementHeader />

      <div className={styles.section}>
        <div className={styles.gamesHeader}>
          <h2 className={styles.sectionTitle}>Games</h2>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={refreshGames}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <GameFilters
          filterText={filterText}
          onFilterChange={setFilterText}
          totalGames={count}
          filteredCount={items.length}
        />

        {isLoading ? (
          <GameManagementLoadingState />
        ) : items.length === 0 ? (
          <GameManagementEmptyState hasGames={false} />
        ) : (
          <GamesTable games={items} />
        )}
      </div>
    </section>
  );
};

export default GameManagement;

