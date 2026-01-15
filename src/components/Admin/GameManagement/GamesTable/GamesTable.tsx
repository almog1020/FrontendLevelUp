import type { AdminGameItem } from "../../../../services/apis/games";
import styles from "../GameManagement.module.scss";

interface GamesTableProps {
  games: AdminGameItem[];
}

export function GamesTable({ games }: GamesTableProps) {
  const formatPrice = (price: number | null | undefined, currency: string | null | undefined): string => {
    if (price == null) return "—";
    return `${price.toFixed(2)} ${currency || "USD"}`;
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Store</th>
            <th>Price</th>
            <th>Deal</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
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
              <td>{game.store || "—"}</td>
              <td>{formatPrice(game.price, game.currency)}</td>
              <td>
                {game.deal_url ? (
                  <a
                    href={game.deal_url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.dealLink}
                  >
                    Open
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

