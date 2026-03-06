import { useNavigate } from 'react-router-dom';
import styles from './TrendingGames.module.scss';
import { GameCard } from '../GameCard/GameCard';
import type { Game } from '../../interfaces/game.interface';
import { normalizeCsId } from '../../utils/gameId';

interface TrendingGamesProps {
  games: Game[];
  hideHeader?: boolean;
}

export const TrendingGames = ({ games, hideHeader = false }: TrendingGamesProps) => {
  const navigate = useNavigate();

  const handleGameClick = (game: Game) => {
    const normalizedId = normalizeCsId(game.id);
    navigate(`/game/${normalizedId}`, { state: { game } });
  };

  return (
    <section className={styles.trendingGames}>
      {!hideHeader && (
        <div className={styles.trendingGames__header}>
          <div className={styles.trendingGames__headerContent}>
            <span className={styles.trendingGames__icon}>📈</span>
            <div>
              <h2 className={styles.trendingGames__title}>Trending Games</h2>
              <p className={styles.trendingGames__subtitle}>Most popular games right now</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.trendingGames__grid}>
        {games.map((game) => (
          <GameCard
            key={game.id}
            id={normalizeCsId(game.id)}
            title={game.title}
            image={game.image}
            discount={game.discount}
            price={game.currentPrice}
            originalPrice={game.originalPrice}
            onClick={() => handleGameClick(game)}
          />
        ))}
      </div>
    </section>
  );
};

