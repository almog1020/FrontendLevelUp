import styles from './GameCard.module.scss';
import { WishlistButton } from '../WishlistButton/WishlistButton';
import { normalizeCsId } from '../../utils/gameId';

export interface GameCardProps {
  id: string;
  title: string;
  image: string;
  discount: number;
  price: number;
  originalPrice: number;
  onClick?: () => void;
}

export const GameCard = ({
  id,
  title,
  image,
  discount,
  price,
  originalPrice,
  onClick,
}: GameCardProps) => {
  const normalizedId = normalizeCsId(id);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={styles.gameCard} onClick={handleCardClick} role="button" tabIndex={0} onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (onClick) {
          onClick();
        }
      }
    }}>
      <div className={styles.gameCard__imageContainer}>
        <img src={image} alt={title} className={styles.gameCard__image} />
        {discount > 0 && (
          <div className={styles.gameCard__discountBadge}>
            ~{discount}%
          </div>
        )}
        <div className={styles.gameCard__wishlist} onClick={(e) => e.stopPropagation()}>
          <WishlistButton
            gameId={normalizedId}
            size="sm"
            showLabel={false}
            snapshot={{ title, thumb: image }}
          />
        </div>
      </div>
      <div className={styles.gameCard__content}>
        <h3 className={styles.gameCard__title}>{title}</h3>
        <div className={styles.gameCard__pricing}>
          <span className={styles.gameCard__currentPrice}>${price.toFixed(2)}</span>
          {originalPrice > price && (
            <span className={styles.gameCard__originalPrice}>${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

