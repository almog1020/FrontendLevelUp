import type { IgdbGame } from "../../../../services/apis/games";
import styles from "../GameManagement.module.scss";

interface GamesTableProps {
  games: IgdbGame[];
}

export function GamesTable({ games }: GamesTableProps) {
  const formatGenres = (genres: string[]): string => {
    if (!genres || genres.length === 0) return "—";
    if (genres.length <= 2) {
      return genres.join(", ");
    }
    return `${genres.slice(0, 2).join(", ")} +${genres.length - 2}`;
  };

  const formatRating = (rating: number | null | undefined): string => {
    if (rating == null) return "—";
    return rating.toFixed(1);
  };

  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "—";
    try {
      const d = new Date(date);
      return d.toLocaleDateString();
    } catch {
      return date;
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Genres</th>
            <th>Rating</th>
            <th>Release Date</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={`${game.name}-${index}`}>
              <td>
                {game.image_url ? (
                  <img
                    src={game.image_url}
                    alt={game.name}
                    className={styles.gameImage}
                  />
                ) : (
                  <span className={styles.noImage}>No Image</span>
                )}
              </td>
              <td className={styles.titleCell}>{game.name}</td>
              <td>{formatGenres(game.genres)}</td>
              <td>{formatRating(game.rating)}</td>
              <td>{formatDate(game.release_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

