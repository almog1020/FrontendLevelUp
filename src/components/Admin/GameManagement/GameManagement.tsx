import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGames, triggerEtl, type Game, type EtlResult } from "../../../services/apis/games.ts";
import { toast } from "react-toastify";
import PopularGenre, { type GenreStats } from "../AdminPage/PopularGenre/PopularGenre.tsx";
import styles from "./GameManagement.module.scss";

const GameManagement: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [etlLoading, setEtlLoading] = useState<boolean>(false);
  const [etlResult, setEtlResult] = useState<EtlResult | null>(null);
  const [etlError, setEtlError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");

  // Fetch games on mount
  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const fetchedGames = await getAllGames();
      setGames(fetchedGames);
    } catch (e: unknown) {
      toast.error((e as Error).message || "Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const handleRunEtl = async () => {
    try {
      setEtlLoading(true);
      setEtlError(null);
      setEtlResult(null);
      const result = await triggerEtl(searchTerm || undefined);
      setEtlResult(result);
      toast.success("ETL completed successfully!");
      // Automatically refresh games list after successful ETL
      await loadGames();
    } catch (e: unknown) {
      const errorMessage = (e as Error).message;
      setEtlError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setEtlLoading(false);
    }
  };

  // Filter games by title (client-side)
  const filteredGames = useMemo(() => {
    if (!filterText) return games;
    const lowerFilter = filterText.toLowerCase();
    return games.filter((game) =>
      game.title?.toLowerCase().includes(lowerFilter)
    );
  }, [games, filterText]);

  // Compute genre distribution for chart
  const genreStats = useMemo(() => {
    if (games.length === 0) return [];

    // Count games per genre, treating missing/empty genre as "Unknown"
    const genreCounts: Record<string, number> = {};
    
    games.forEach((game) => {
      const genre = game.genre?.trim() || "Unknown";
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });

    // Convert to array and sort by count descending
    const genreArray: GenreStats[] = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    // Take top 5 genres and merge the rest into "Other"
    if (genreArray.length <= 5) {
      return genreArray;
    }

    const top5 = genreArray.slice(0, 5);
    const others = genreArray.slice(5);
    const otherCount = others.reduce((sum, item) => sum + item.count, 0);

    return [...top5, { genre: "Other", count: otherCount }];
  }, [games]);

  // Get source from game ID
  const getSource = (gameId: string): string => {
    if (gameId.startsWith("cs_")) return "CheapShark";
    if (gameId.startsWith("rawg_")) return "RAWG";
    return "Unknown";
  };

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Game Management</h1>
        </div>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          Back to dashboard
        </button>
      </header>

      {/* Genre Chart Section */}
      <div className={styles.chartSection}>
        <PopularGenre genreStats={genreStats} />
      </div>

      {/* ETL Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>ETL</h2>
        <div className={styles.etlControls}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search term (optional)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={etlLoading}
          />
          <button
            type="button"
            className={styles.etlButton}
            onClick={handleRunEtl}
            disabled={etlLoading}
          >
            {etlLoading ? "Running..." : "Run ETL"}
          </button>
        </div>

        {etlLoading && (
          <div className={styles.loading}>Running ETL pipeline...</div>
        )}

        {etlError && (
          <div className={styles.error}>
            <strong>Error:</strong> {etlError}
          </div>
        )}

        {etlResult && (
          <div className={styles.result}>
            <h3>ETL Result</h3>
            <div className={styles.resultDetails}>
              <p>
                <strong>Status:</strong> {etlResult.status}
              </p>
              <p>
                <strong>Timestamp:</strong> {etlResult.timestamp}
              </p>
              <p>
                <strong>Games Processed:</strong> {etlResult.games_processed}
              </p>
              <p>
                <strong>Prices Processed:</strong> {etlResult.prices_processed}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Games Section */}
      <div className={styles.section}>
        <div className={styles.gamesHeader}>
          <h2 className={styles.sectionTitle}>Games</h2>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={loadGames}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className={styles.filterControls}>
          <input
            type="text"
            className={styles.filterInput}
            placeholder="Filter by title..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <div className={styles.count}>
            Showing {filteredGames.length} of {games.length} games
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading games...</div>
        ) : filteredGames.length === 0 ? (
          <div className={styles.empty}>
            {games.length === 0
              ? "No games found. Run ETL to load games."
              : "No games match the filter."}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Source</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game) => (
                  <tr key={game.id}>
                    <td>
                      {game.image_url ? (
                        <img
                          src={game.image_url}
                          alt={game.title}
                          className={styles.gameImage}
                        />
                      ) : (
                        <span className={styles.noImage}>No image</span>
                      )}
                    </td>
                    <td className={styles.titleCell}>{game.title}</td>
                    <td>{game.genre || "N/A"}</td>
                    <td>{getSource(game.id)}</td>
                    <td className={styles.idCell}>{game.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default GameManagement;
