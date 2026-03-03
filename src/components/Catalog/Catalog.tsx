import { useState, useEffect, useCallback } from 'react';
import { searchDeals, getDealUrl, type CatalogGame, type SortOption } from '../../services/apis/cheapshark';
import styles from './Catalog.module.scss';

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
                {loading ? 'Loading...' : `${games.length} games found`}
            </p>

            {loading ? (
                <div className={styles.loading}>Loading games...</div>
            ) : games.length === 0 ? (
                <div className={styles.empty}>
                    <p>No games found</p>
                    <button onClick={() => setSearch('')} className={styles.resetBtn}>
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {games.map(game => (
                        <article key={`${game.id}-${game.dealID}`} className={styles.card} onClick={() => handleGameClick(game.dealID)}>
                            <div className={styles.imageWrapper}>
                                <img src={game.image} alt={game.title} className={styles.image} loading="lazy" />
                                {game.discount > 0 && (
                                    <span className={styles.discount}>-{game.discount}%</span>
                                )}
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
