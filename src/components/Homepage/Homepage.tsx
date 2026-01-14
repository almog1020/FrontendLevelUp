import { useEffect, useState } from 'react';
import { Header } from '../Header/Header';
import { Hero } from '../Hero/Hero';
import { DealOfTheDay } from '../DealOfTheDay/DealOfTheDay';
import { TrendingGames } from '../TrendingGames/TrendingGames';
import { getTrendingGames, getDealOfTheDay } from '../../services/apis/games';
import type { Game } from '../../interfaces/game.interface';
import styles from './Homepage.module.scss';

export const Homepage = () => {
  const [dealOfTheDay, setDealOfTheDay] = useState<Game | null>(null);
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);
  const [searchResults, setSearchResults] = useState<Game[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      setSearchResults(null); // Clear search results when fetching normal games
      
      // Fetch deal of the day and trending games in parallel
      const [deal, trending] = await Promise.all([
        getDealOfTheDay(),
        getTrendingGames(),
      ]);
      
      setDealOfTheDay(deal);
      setTrendingGames(trending);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
      console.error('Error fetching games:', err);
    } finally {
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
      fetchGames();
    };

    const handleGamesSearch = (e: CustomEvent<{ results: Game[]; query: string }>) => {
      setSearchResults(e.detail.results);
      setSearchQuery(e.detail.query);
      setLoading(false);
      setError(null);
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
      <Header />
      <main className={styles.main}>
        <Hero />
        {loading && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Loading games...
          </div>
        )}
        {error && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
            Error: {error}
          </div>
        )}
        {!loading && !error && (
          <>
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
                  <TrendingGames games={searchResults} />
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    No games found for "{searchQuery}"
                  </div>
                )}
              </>
            ) : (
              // Show normal homepage content
              <>
                {dealOfTheDay && <DealOfTheDay game={dealOfTheDay} />}
                {trendingGames.length > 0 && <TrendingGames games={trendingGames} />}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};
