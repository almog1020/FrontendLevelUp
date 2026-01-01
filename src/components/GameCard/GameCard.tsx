import { useState } from 'react';
import styles from './GameCard.module.scss';

export interface GameCardProps {
  id: string;
  title: string;
  image: string;
  discount: number;
  price: number;
  originalPrice: number;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  onClick?: () => void;
}

export const GameCard = ({
  id,
  title,
  image,
  discount,
  price,
  originalPrice,
  isWishlisted = false,
  onWishlistToggle,
  onClick,
}: GameCardProps) => {
  const [wishlisted, setWishlisted] = useState(isWishlisted);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !wishlisted;
    setWishlisted(newState);
    if (onWishlistToggle) {
      onWishlistToggle(id);
    }
  };

  return (
    <div className={styles.gameCard} onClick={onClick}>
      <div className={styles.gameCard__imageContainer}>
        <img src={image} alt={title} className={styles.gameCard__image} />
        {discount > 0 && (
          <div className={styles.gameCard__discountBadge}>
            ~{discount}%
          </div>
        )}
        <button
          className={`${styles.gameCard__wishlist} ${wishlisted ? styles.gameCard__wishlist_active : ''}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? '❤️' : '♡'}
        </button>
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

