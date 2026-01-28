import {useEffect, useState} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import type {Game} from '../../interfaces/game.interface';
import styles from './GameDetail.module.scss';
import AddReview from "../AddReview/AddReview.tsx";
import type {ReviewRecord} from "../../interfaces/review.interface.ts";
import {getGameReviews} from "../../services/apis/reviews.ts";
import {getGameById} from "../../services/apis/games.ts";
import Stars from "../Stars/Stars.tsx";

export const GameDetail = () => {
  const [activeTab, setActiveTab] = useState<'description' | 'price' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [open,setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { game: initialGame }:{game?:Game} = location.state || {};
  const [game, setGame] = useState<Game | null>(initialGame || null);
  const [results,setResults] = useState<ReviewRecord[]>([])

  useEffect(() => {
    const fetchGameData = async () => {
      if (!id) {
        setError('Game ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const gameData = await getGameById(id);
        if (gameData) {
          setGame(gameData);
        } else {
          setError('Game not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  useEffect(() => {
    if (game?.title) {
      const fetchData = async () => {
        const results = await getGameReviews(game.title);
        setResults(results);
      };
      fetchData();
    }
  }, [game?.title]);


  const handleShare = async () => {
    if (!game) return;
    
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
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className={styles.gameDetail}>
        <div className={styles.loading}>Loading game details...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className={styles.gameDetail}>
        <div className={styles.loading}>{error || 'Game not found'}</div>
      </div>
    );
  }

  const bestPriceUrl = game.priceComparison?.find(item => item.url)?.url;

  return (
    <div className={styles.gameDetail}>
      <AddReview
          open={open}
          gameTitle={game.title}
          onClose={() => setOpen(false)}
      />
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Left Side - Image Gallery */}
          <div className={styles.imageSection}>
            <div className={styles.mainImageContainer}>
              <img src={game.image} alt={game.title} className={styles.mainImage} />
            </div>
          </div>

          {/* Right Side - Game Info */}
          <div className={styles.infoSection}>
            <h1 className={styles.title}>{game.title}</h1>

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
                {bestPriceUrl ? (
                  <a
                    href={bestPriceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.buyButton}
                  >
                    Buy Now
                  </a>
                ) : (
                  <button className={styles.buyButton}>
                    Buy Now
                  </button>
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
                <div className={styles.header}>
                  <h2 className={styles.sectionTitle}>Reviews</h2>
                  <button className={styles.addBtn} onClick={() => setOpen(true)}>
                    Open Review
                  </button>
                </div>
                {results.length > 0 ? (
                  <div className={styles.reviewsList}>
                    {results.map((result, index) => (
                      <div key={index} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                            <div className={styles.avatar}>
                              {result.user ? result.user.name[0].toUpperCase() : "G"}
                            </div>
                          <div className={styles.reviewContent}>
                            <div className={styles.reviewContentHeader}>
                            <span className={styles.reviewAuthor}>
                              {result.user ? result.user.name : "guest"}
                            </span>
                              <div className={styles.reviewRating}>
                                <Stars value={result.review.star}/>
                              </div>
                            </div>
                            <p className={styles.reviewComment}>{result.review.comment}</p>
                          </div>
                        </div>
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

