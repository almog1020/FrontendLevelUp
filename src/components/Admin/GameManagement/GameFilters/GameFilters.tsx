import styles from "../GameManagement.module.scss";

interface GameFiltersProps {
  filterText: string;
  onFilterChange: (value: string) => void;
  totalGames: number;
  filteredCount: number;
}

export function GameFilters({
  filterText,
  onFilterChange,
  totalGames,
  filteredCount,
}: GameFiltersProps) {
  return (
    <div className={styles.filterControls}>
      <input
        type="text"
        className={styles.filterInput}
        placeholder="Filter by title..."
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
      />
      <div className={styles.count}>
        Showing {filteredCount} of {totalGames} games
      </div>
    </div>
  );
}

