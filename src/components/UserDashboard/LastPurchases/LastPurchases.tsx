import * as React from 'react';
import styles from './LastPurchases.module.scss';

export interface LastPurchaseGame {
    id: string;
    title: string;
    genre: string[];
    image: string;
}

interface LastPurchasesProps {
    games: LastPurchaseGame[];
    onGameClick?: (gameId: string) => void;
}

export const LastPurchases: React.FC<LastPurchasesProps> = ({ games, onGameClick }) => {
    return (
        <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Last Purchases</h2>
            <div className={styles.gamesGrid}>
                {games.length === 0 ? (
                    <p className={styles.emptyMessage}>No purchases yet. Start shopping to see your purchases here!</p>
                ) : (
                    games.map((game) => (
                        <div
                            key={game.id}
                            className={styles.gameCard}
                            onClick={() => onGameClick?.(game.id)}
                        >
                            <div className={styles.gameImageContainer}>
                                <img
                                    src={game.image || 'https://via.placeholder.com/300x169'}
                                    alt={game.title}
                                    className={styles.gameImage}
                                />
                            </div>
                            <h4 className={styles.gameTitle}>
                                {game.title}
                            </h4>
                            <div className={styles.genreTags}>
                                {game.genre.slice(0, 2).map((genre, idx) => (
                                    <span
                                        key={idx}
                                        className={styles.genreTag}
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
