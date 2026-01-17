import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../Header/Header';
import { GameDetailSkeleton } from '../GameDetailSkeleton/GameDetailSkeleton';
import { getGameById } from '../../services/apis/games';
import type { Game } from '../../interfaces/game.interface';
import styles from './GameDetail.module.scss';

export const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'price' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const gameData = await getGameById(id);
        if (!gameData) {
          setError('Game not found. It may no longer be available.');
          setLoading(false);
          return;
        }
        setGame(gameData);
      } catch (error) {
        console.error('Failed to fetch game:', error);
        setError(error instanceof Error ? error.message : 'Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className={styles.gameDetail}>
        <Header />
        <GameDetailSkeleton />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className={styles.gameDetail}>
        <Header />
        <main className={styles.main}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Game Not Found</h2>
            <p>{error || 'The game you are looking for is not available.'}</p>
            <button 
              onClick={() => navigate('/')}
              style={{ 
                marginTop: '1rem', 
                padding: '0.5rem 1rem', 
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Return to Homepage
            </button>
          </div>
        </main>
      </div>
    );
  }

  const images = game.images && game.images.length > 0 ? game.images : [game.image];
  const currentImage = images[selectedImageIndex] || game.image;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className={styles.ratingStars}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className={styles.starFull}>★</span>
        ))}
        {hasHalfStar && <span className={styles.starHalf}>★</span>}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className={styles.starEmpty}>★</span>
        ))}
      </div>
    );
  };

  const renderDifficulty = (difficulty: number) => {
    return (
      <div className={styles.difficulty}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`${styles.difficultyIcon} ${i < difficulty ? styles.difficultyIconActive : ''}`}
          >
            ✕
          </span>
        ))}
      </div>
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: game.title,
          text: `Check out ${game.title} on LevelUp!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className={styles.gameDetail}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Left Side - Image Gallery */}
          <div className={styles.imageSection}>
            <div className={styles.mainImageContainer}>
              <img src={currentImage} alt={game.title} className={styles.mainImage} />
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnailContainer}>
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.thumbnailActive : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={img} alt={`${game.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Game Info */}
          <div className={styles.infoSection}>
            <h1 className={styles.title}>{game.title}</h1>

            {/* Rating */}
            {game.rating !== undefined && (
              <div className={styles.rating}>
                {renderStars(game.rating)}
                <span className={styles.ratingText}>
                  {game.rating.toFixed(1)} ({game.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Genre Tags */}
            <div className={styles.genres}>
              {game.genres.map((genre, index) => (
                <span key={index} className={styles.genreTag}>
                  {genre}
                </span>
              ))}
            </div>

            {/* Price Box */}
            <div className={styles.priceBox}>
              <div className={styles.priceBoxLabel}>Best Price</div>
              <div className={styles.priceBoxContent}>
                <div className={styles.priceRow}>
                  <span className={styles.currentPrice}>${game.currentPrice.toFixed(2)}</span>
                  {game.originalPrice > game.currentPrice && (
                    <span className={styles.originalPrice}>${game.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                {game.discount > 0 && (
                  <div className={styles.discountBadge}>Save {game.discount}%</div>
                )}
                {game.storeName && (
                  <div className={styles.storeName}>at {game.storeName}</div>
                )}
                {game.priceComparison && game.priceComparison.length > 0 && game.priceComparison[0].url ? (
                  <a
                    href={game.priceComparison[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.buyButton}
                  >
                    Buy Now
                  </a>
                ) : (
                  <button className={styles.buyButton}>Buy Now</button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button
                className={`${styles.wishlistButton} ${isWishlisted ? styles.wishlistButtonActive : ''}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                {isWishlisted ? '❤️' : '♡'} Add to Wishlist
              </button>
              <button className={styles.shareButton} onClick={handleShare}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>

            {/* Game Details */}
            <div className={styles.gameDetails}>
              {game.releaseDate && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Release Date:</span>
                  <span className={styles.detailValue}>{game.releaseDate}</span>
                </div>
              )}
              {game.difficulty !== undefined && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Difficulty:</span>
                  {renderDifficulty(game.difficulty)}
                </div>
              )}
              {game.platforms && game.platforms.length > 0 && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Platforms:</span>
                  <span className={styles.detailValue}>{game.platforms.length}+</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - Tabs */}
        <div className={styles.tabsSection}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'description' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'price' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('price')}
            >
              Price Comparison
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews {game.reviewCount ? `(${game.reviewCount})` : ''}
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.descriptionContent}>
                <h2 className={styles.sectionTitle}>About This Game</h2>
                <p className={styles.descriptionText}>{game.description}</p>
              </div>
            )}

            {activeTab === 'price' && (
              <div className={styles.priceComparisonContent}>
                <h2 className={styles.sectionTitle}>Price Comparison</h2>
                {game.priceComparison && game.priceComparison.length > 0 ? (
                  <div className={styles.priceTable}>
                    {game.priceComparison.map((priceItem, index) => (
                      <div key={index} className={styles.priceRow}>
                        <div className={styles.priceInfo}>
                          <span className={styles.priceStore}>{priceItem.store}</span>
                          <span className={styles.priceValue}>${priceItem.price.toFixed(2)}</span>
                        </div>
                        {priceItem.url && (
                          <a
                            href={priceItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.priceComparisonBuyButton}
                          >
                            <span>View Deal</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No price comparison data available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.reviewsContent}>
                <h2 className={styles.sectionTitle}>Reviews</h2>
                {game.reviews && game.reviews.length > 0 ? (
                  <div className={styles.reviewsList}>
                    {game.reviews.map((review, index) => (
                      <div key={index} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                          <span className={styles.reviewAuthor}>{review.author}</span>
                          <div className={styles.reviewRating}>
                            {renderStars(review.rating)}
                          </div>
                          <span className={styles.reviewDate}>{review.date}</span>
                        </div>
                        <p className={styles.reviewComment}>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

