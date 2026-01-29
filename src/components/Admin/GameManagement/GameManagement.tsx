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
    filterText,
    setFilterText,
    refreshGames,
  } = useGameManagementData();



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
          <GameManagementEmptyState hasGames={count > 0} />
        ) : (
          <GamesTable games={items} />
        )}
      </div>
    </section>
  );
};

export default GameManagement;

