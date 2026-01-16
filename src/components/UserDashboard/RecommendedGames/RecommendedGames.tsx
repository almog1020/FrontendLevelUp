import * as React from 'react';
import styles from './RecommendedGames.module.scss';

export interface RecommendedGame {
    id: string;
    title: string;
    rating: number;
    price: number;
    image: string;
}

interface RecommendedGamesProps {
    games: RecommendedGame[];
    onRefresh?: () => void;
    onGameClick?: (gameId: string) => void;
}

export const RecommendedGames: React.FC<RecommendedGamesProps> = ({
    games,
    onRefresh,
    onGameClick
}) => {
    return (
        <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2 className={styles.sectionTitle}>Recommended for You</h2>
                    <p className={styles.sectionSubtitle}>
                        Based on your purchase history and wishlist
                    </p>
                </div>
                <button className={styles.ghostButton} onClick={onRefresh}>
                    Refresh
                </button>
            </div>
            <div className={styles.gamesGrid}>
                {games.map((game) => (
                    <div
                        key={game.id}
                        className={styles.gameCard}
                        onClick={() => onGameClick?.(game.id)}
                    >
                        <div className={styles.gameImageContainer}>
                            <img
                                src={game.image}
                                alt={game.title}
                                className={styles.gameImage}
                            />
                        </div>
                        <h4 className={styles.gameTitle}>
                            {game.title}
                        </h4>
                        <div className={styles.gameRatingPrice}>
                            <div className={styles.starRating}>
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`${styles.star} ${i < Math.floor(game.rating) ? styles.starFilled : styles.starEmpty}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className={styles.gamePrice}>
                                ${game.price}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
