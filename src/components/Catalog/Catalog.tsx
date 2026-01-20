import { useState, useEffect, useCallback } from 'react';
import { searchDeals, getDealUrl, type CatalogGame, type SortOption, type Platform } from '../../services/apis/cheapshark';
import { getWishlistIds, addToWishlist, removeFromWishlist } from '../../services/apis/wishlist';
import styles from './Catalog.module.scss';

const PLATFORMS: { value: Platform; label: string }[] = [
    { value: 'all', label: 'All Platforms' },
    { value: 'pc', label: 'PC' },
    { value: 'playstation', label: 'PlayStation' },
    { value: 'xbox', label: 'Xbox' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'savings', label: 'Best Deals' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'title', label: 'Name: A-Z' },
    { value: 'rating', label: 'Rating' },
];

export const Catalog = () => {
    const [games, setGames] = useState<CatalogGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('savings');
    const [platform, setPlatform] = useState<Platform>('all');
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    // Fetch wishlist on mount
    useEffect(() => {
        if (isLoggedIn) {
            getWishlistIds()
                .then(ids => setWishlist(new Set(ids)))
                .catch(() => setWishlist(new Set()));
        }
    }, [isLoggedIn]);

    // Listen for auth changes
    useEffect(() => {
        const handleAuthChange = () => {
            const loggedIn = !!localStorage.getItem('token');
            setIsLoggedIn(loggedIn);
            if (!loggedIn) setWishlist(new Set());
        };
        window.addEventListener('auth-state-changed', handleAuthChange);
        return () => window.removeEventListener('auth-state-changed', handleAuthChange);
    }, []);

    const fetchGames = useCallback(async () => {
        setLoading(true);
        try {
            const results = await searchDeals({ search: search || undefined, sortBy });
            setGames(results);
        } catch (err) {
            console.error('Failed to fetch games:', err);
            setGames([]);
        } finally {
            setLoading(false);
        }
    }, [search, sortBy]);

    useEffect(() => {
        const debounce = setTimeout(fetchGames, 300);
        return () => clearTimeout(debounce);
    }, [fetchGames]);

    const filteredGames = games.filter(game => {
        if (platform === 'all') return true;
        const title = game.title.toLowerCase();
        if (platform === 'playstation') return title.includes('ps4') || title.includes('ps5') || title.includes('playstation');
        if (platform === 'xbox') return title.includes('xbox');
        return true;
    });

    const toggleWishlist = async (game: CatalogGame) => {
        if (!isLoggedIn) {
            alert('Please log in to add games to your wishlist');
            return;
        }

        const inWishlist = wishlist.has(game.id);

        // Optimistic update
        setWishlist(prev => {
            const next = new Set(prev);
            if (inWishlist) {
                next.delete(game.id);
            } else {
                next.add(game.id);
            }
            return next;
        });

        try {
            if (inWishlist) {
                await removeFromWishlist(game.id);
            } else {
                await addToWishlist({
                    game_id: game.id,
                    game_title: game.title,
                    game_image_url: game.image,
                    game_price: game.price,
                    game_original_price: game.originalPrice,
                    game_discount: game.discount,
                    store_id: game.storeID,
                    deal_id: game.dealID,
                });
            }
        } catch (err) {
            // Revert on error
            setWishlist(prev => {
                const next = new Set(prev);
                if (inWishlist) {
                    next.add(game.id);
                } else {
                    next.delete(game.id);
                }
                return next;
            });
            console.error('Failed to update wishlist:', err);
        }
    };

    const handleGameClick = (dealID: string) => {
        window.open(getDealUrl(dealID), '_blank');
    };

    return (
        <div className={styles.catalog}>
            <header className={styles.header}>
                <h1 className={styles.title}>Game Catalog</h1>
                <p className={styles.subtitle}>Browse deals from multiple stores</p>
            </header>

            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Search games..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={styles.searchInput}
                />

                <div className={styles.filters}>
                    <select
                        value={platform}
                        onChange={e => setPlatform(e.target.value as Platform)}
                        className={styles.select}
                    >
                        {PLATFORMS.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as SortOption)}
                        className={styles.select}
                    >
                        {SORT_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <p className={styles.resultCount}>
                {loading ? 'Loading...' : `${filteredGames.length} games found`}
            </p>

            {loading ? (
                <div className={styles.loading}>Loading games...</div>
            ) : filteredGames.length === 0 ? (
                <div className={styles.empty}>
                    <p>No games found</p>
                    <button onClick={() => { setSearch(''); setPlatform('all'); }} className={styles.resetBtn}>
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredGames.map(game => (
                        <article key={`${game.id}-${game.dealID}`} className={styles.card} onClick={() => handleGameClick(game.dealID)}>
                            <div className={styles.imageWrapper}>
                                <img src={game.image} alt={game.title} className={styles.image} loading="lazy" />
                                {game.discount > 0 && (
                                    <span className={styles.discount}>-{game.discount}%</span>
                                )}
                                <button
                                    className={`${styles.wishlistBtn} ${wishlist.has(game.id) ? styles.wishlisted : ''}`}
                                    onClick={e => { e.stopPropagation(); toggleWishlist(game); }}
                                    aria-label={wishlist.has(game.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    {wishlist.has(game.id) ? '❤️' : '♡'}
                                </button>
                            </div>
                            <div className={styles.info}>
                                <h3 className={styles.gameTitle}>{game.title}</h3>
                                <div className={styles.pricing}>
                                    <span className={styles.price}>${game.price.toFixed(2)}</span>
                                    {game.originalPrice > game.price && (
                                        <span className={styles.originalPrice}>${game.originalPrice.toFixed(2)}</span>
                                    )}
                                </div>
                                {game.rating > 0 && (
                                    <div className={styles.rating}>⭐ {game.rating}%</div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};
