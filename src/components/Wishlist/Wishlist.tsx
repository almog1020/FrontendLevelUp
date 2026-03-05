import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Wishlist.module.scss";
import { useWishlist } from "../../contexts/WishlistContext";
import { WishlistButton } from "../WishlistButton/WishlistButton";
import { normalizeCsId } from "../../utils/gameId";

export const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistGames, isWishlistLoading } = useWishlist();
  const [sortBy, setSortBy] = useState<"title" | "price">("title");

  const sortedGames = useMemo(() => {
    const copy = [...wishlistGames];
    if (sortBy === "price") {
      return copy.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    }
    return copy.sort((a, b) => a.title.localeCompare(b.title));
  }, [wishlistGames, sortBy]);

  if (isWishlistLoading) {
    return <div className={styles.loading}>Loading wishlist...</div>;
  }

  if (sortedGames.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h2 className={styles.title}>Your wishlist is empty</h2>
          <p>Browse the catalog and add games you want to track.</p>
          <button className={styles.emptyButton} onClick={() => navigate("/catalog")}>
            Go to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Wishlist</h1>
      </div>
      <div className={styles.sortBar}>
        <select
          className={styles.sortSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "title" | "price")}
        >
          <option value="title">Sort by Title</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>
      <div className={styles.grid}>
        {sortedGames.map((game) => (
          <article
            key={game.id}
            className={styles.card}
            onClick={() => navigate(`/game/${normalizeCsId(game.id)}`)}
          >
            <img
              src={game.image ?? ""}
              alt={game.title}
              className={styles.image}
            />
            <div className={styles.content}>
              <h3 className={styles.cardTitle}>{game.title}</h3>
              <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <WishlistButton
                  gameId={normalizeCsId(game.id)}
                  size="sm"
                  showLabel={false}
                  initialWishlisted
                  snapshot={{ title: game.title, thumb: game.image ?? null }}
                />
                {game.dealUrl ? (
                  <button
                    className={styles.buyButton}
                    onClick={() => window.open(game.dealUrl ?? "", "_blank")}
                  >
                    Buy Now
                  </button>
                ) : (
                  <button className={styles.buyButton} onClick={() => navigate(`/game/${normalizeCsId(game.id)}`)}>
                    View Game
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
