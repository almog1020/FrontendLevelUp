import * as React from 'react';
import styles from './RecentlyViewed.module.scss';

export interface RecentlyViewedGame {
    id: string;
    title: string;
    genre: string[];
    image: string;
}

interface RecentlyViewedProps {
    games: RecentlyViewedGame[];
    onGameClick?: (gameId: string) => void;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ games, onGameClick }) => {
    return (
        <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Recently Viewed</h2>
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
                ))}
            </div>
        </div>
    );
};
