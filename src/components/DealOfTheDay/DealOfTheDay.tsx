import { useNavigate } from 'react-router-dom';
import styles from './DealOfTheDay.module.scss';
import type { Game } from '../../interfaces/game.interface';

interface DealOfTheDayProps {
  game: Game;
}

export const DealOfTheDay = ({ game }: DealOfTheDayProps) => {
  const navigate = useNavigate();

  const handleViewDeal = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <section id="deal-of-the-day" className={styles.dealOfTheDay}>
      <div className={styles.dealOfTheDay__header}>
        <div className={styles.dealOfTheDay__headerContent}>
          <span className={styles.dealOfTheDay__icon}>🔥</span>
          <div>
            <h2 className={styles.dealOfTheDay__title}>Deal of the Day</h2>
            <p className={styles.dealOfTheDay__subtitle}>Limited time offer - Don't miss out!</p>
          </div>
        </div>
      </div>

      <div className={styles.dealOfTheDay__card}>
        <div className={styles.dealOfTheDay__imageContainer}>
          <img 
            src={game.image} 
            alt={game.title}
            className={styles.dealOfTheDay__image}
          />
          <div className={styles.dealOfTheDay__discountBadge}>
            -{game.discount}% OFF
          </div>
        </div>

        <div className={styles.dealOfTheDay__content}>
          <h3 className={styles.dealOfTheDay__gameTitle}>{game.title}</h3>
          <p className={styles.dealOfTheDay__description}>{game.description}</p>
          
          <div className={styles.dealOfTheDay__genres}>
            {game.genres.map((genre, index) => (
              <span key={index} className={styles.dealOfTheDay__genreTag}>
                {genre}
              </span>
            ))}
          </div>

          <div className={styles.dealOfTheDay__pricing}>
            <span className={styles.dealOfTheDay__currentPrice}>
              {game.currentPrice === 0 ? 'FREE!' : `$${game.currentPrice.toFixed(2)}`}
            </span>
            {game.currentPrice > 0 && (
              <span className={styles.dealOfTheDay__originalPrice}>
                ${game.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button 
            className={styles.dealOfTheDay__cta}
            onClick={handleViewDeal}
          >
            View Deal
          </button>
        </div>
      </div>
    </section>
  );
};

