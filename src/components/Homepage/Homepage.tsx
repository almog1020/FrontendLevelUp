import { useEffect, useState } from 'react';
import { Header } from '../Header/Header';
import { Hero } from '../Hero/Hero';
import { DealOfTheDay } from '../DealOfTheDay/DealOfTheDay';
import { TrendingGames } from '../TrendingGames/TrendingGames';
import { mockGames } from '../../data/mockGames';
import type { Game } from '../../interfaces/game.interface';
import styles from './Homepage.module.scss';

export const Homepage = () => {
  const [games, setGames] = useState<Game[]>(mockGames);

  // Listen for games refresh event from Header/ETL
  useEffect(() => {
    const handleGamesRefresh = () => {
      // Future: Fetch new games data from API
      // For now, just refresh the mock data
      setGames([...mockGames]);
    };

    window.addEventListener('games-refresh', handleGamesRefresh);
    return () => {
      window.removeEventListener('games-refresh', handleGamesRefresh);
    };
  }, []);

  // Find deal of the day
  const dealOfTheDay = games.find(game => game.isDealOfDay);

  // Filter trending games
  const trendingGames = games.filter(game => game.isTrending && !game.isDealOfDay);

  return (
    <div className={styles.homepage}>
      <Header />
      <main className={styles.main}>
        <Hero />
        {dealOfTheDay && <DealOfTheDay game={dealOfTheDay} />}
        {trendingGames.length > 0 && <TrendingGames games={trendingGames} />}
      </main>
    </div>
  );
};
