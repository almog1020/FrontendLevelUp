import { useEffect, useState } from 'react';
import { Hero } from '../Hero/Hero';
import { DealOfTheDay } from '../DealOfTheDay/DealOfTheDay';
import { DealOfTheDaySkeleton } from '../DealOfTheDaySkeleton/DealOfTheDaySkeleton';
import { TrendingGames } from '../TrendingGames/TrendingGames';
import { GameCardSkeleton } from '../GameCardSkeleton/GameCardSkeleton';
import { getTrendingGames, getDealOfTheDay } from '../../services/apis/games';
import type { Game } from '../../interfaces/game.interface';
import styles from './Homepage.module.scss';

export const Homepage = () => {
  const [dealOfTheDay, setDealOfTheDay] = useState<Game | null>(null);
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);
  const [searchResults, setSearchResults] = useState<Game[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      setSearchResults(null); // Clear search results when fetching normal games
      setTrendingGames([]); // Clear existing games
      setDealOfTheDay(null); // Clear deal of the day

      // Fetch deal of the day first (single game, fast)
      getDealOfTheDay()
          .then((deal) => {
            if (deal) {
              setDealOfTheDay(deal);
            }
          })
          .catch((err) => {
            console.error('Error fetching deal of the day:', err);
          });

      // Fetch trending games and add them one by one as they arrive
      getTrendingGames()
          .then((trending) => {
            // Add games one by one for progressive display
            trending.forEach((game, index) => {
              setTimeout(() => {
                setTrendingGames((prev) => {
                  // Check if game already exists to avoid duplicates
                  if (prev.some((g) => g.id === game.id)) {
                    return prev;
                  }
                  return [...prev, game];
                });
              }, index * 30); // Small delay between each game (30ms for smooth appearance)
            });
            // Mark loading as complete after all games are scheduled
            setTimeout(() => setLoading(false), trending.length * 30 + 100);
          })
          .catch((err) => {
            setError(err instanceof Error ? err.message : 'Failed to load games');
            console.error('Error fetching trending games:', err);
            setLoading(false);
          });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
      console.error('Error fetching games:', err);
      setLoading(false);
    }
  };

  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  // Listen for games refresh event from Header/ETL
  useEffect(() => {
    const handleGamesRefresh = () => {
      setSearchQuery(''); // Clear search query
      setSearchResults(null); // Clear search results
      fetchGames();
    };

    const handleGamesSearch = (e: CustomEvent<{ results: Game[]; query: string }>) => {
      setSearchQuery(e.detail.query);
      setSearchResults([]); // Clear previous results
      setError(null);

      // Add games one by one for progressive display
      const results = e.detail.results;
      results.forEach((game, index) => {
        setTimeout(() => {
          setSearchResults((prev) => {
            // Check if game already exists to avoid duplicates
            if (prev && prev.some((g) => g.id === game.id)) {
              return prev;
            }
            return prev ? [...prev, game] : [game];
          });
        }, index * 30); // Small delay between each game (30ms for smooth appearance)
      });
    };

    const handleGamesSearchError = (e: CustomEvent<{ error: string }>) => {
      setError(e.detail.error);
      setLoading(false);
    };

    window.addEventListener('games-refresh', handleGamesRefresh);
    window.addEventListener('games-search', handleGamesSearch as EventListener);
    window.addEventListener('games-search-error', handleGamesSearchError as EventListener);

    return () => {
      window.removeEventListener('games-refresh', handleGamesRefresh);
      window.removeEventListener('games-search', handleGamesSearch as EventListener);
      window.removeEventListener('games-search-error', handleGamesSearchError as EventListener);
    };
  }, []);

  return (
      <div className={styles.homepage}>
        <main className={styles.main}>
          {searchResults === null && <Hero />}
          {error && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                Error: {error}
              </div>
          )}
          {searchResults !== null ? (
              // Show search results
              <>
                {searchQuery && (
                    <div style={{ padding: '1rem 2rem' }}>
                      <h2>Search Results for "{searchQuery}"</h2>
                      <p>{searchResults.length} game{searchResults.length !== 1 ? 's' : ''} found</p>
                    </div>
                )}
                {searchResults.length > 0 ? (
                    <TrendingGames games={searchResults} hideHeader />
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      No games found for "{searchQuery}"
                    </div>
                )}
              </>
          ) : (
              // Show normal homepage content - games appear progressively
              <>
                {loading && !dealOfTheDay ? (
                    <DealOfTheDaySkeleton />
                ) : (
                    dealOfTheDay && <DealOfTheDay game={dealOfTheDay} />
                )}
                {loading && trendingGames.length === 0 ? (
                    <section className={styles.skeletonSection}>
                      <div className={styles.skeletonSection__header}>
                        <div className={styles.skeletonSection__headerContent}>
                          <span className={styles.skeletonSection__icon}>📈</span>
                          <div>
                            <h2 className={styles.skeletonSection__title}>Trending Games</h2>
                            <p className={styles.skeletonSection__subtitle}>Most popular games right now</p>
                          </div>
                        </div>
                      </div>
                      <div className={styles.skeletonSection__grid}>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <GameCardSkeleton key={index} />
                        ))}
                      </div>
                    </section>
                ) : (
                    trendingGames.length > 0 && <TrendingGames games={trendingGames} />
                )}
              </>
          )}
        </main>
      </div>
  );
};