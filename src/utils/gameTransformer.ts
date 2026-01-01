import type { BackendGame, BackendGamePrice } from '../interfaces/backend.interface';
import type { Game } from '../interfaces/game.interface';

/**
 * Calculate prices and discount from an array of prices
 */
export function calculatePrices(prices: BackendGamePrice[]): {
  currentPrice: number;
  originalPrice: number;
  discount: number;
} {
  if (!prices.length) {
    return { currentPrice: 0, originalPrice: 0, discount: 0 };
  }

  const priceValues = prices.map((p) => p.price).filter((p) => p > 0);
  
  if (!priceValues.length) {
    return { currentPrice: 0, originalPrice: 0, discount: 0 };
  }

  const currentPrice = Math.min(...priceValues);
  // Use highest price as original, or estimate based on common discount patterns
  const originalPrice = Math.max(...priceValues) || currentPrice * 1.5;
  const discount =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  return { currentPrice, originalPrice, discount };
}

/**
 * Generate a placeholder description for games without one
 */
function generateDescription(title: string, genre: string | null): string {
  const genreText = genre ? ` ${genre} game` : ' game';
  return `Experience ${title}, an exciting${genreText} that offers hours of entertainment. Compare prices across all stores to find the best deal.`;
}

/**
 * Transform a backend game with prices to frontend Game format
 */
export function transformBackendGame(
  backendGame: BackendGame,
  prices: BackendGamePrice[]
): Game {
  const { currentPrice, originalPrice, discount } = calculatePrices(prices);
  const genres = backendGame.genre ? [backendGame.genre] : [];

  return {
    id: backendGame.id,
    title: backendGame.title,
    description: generateDescription(backendGame.title, backendGame.genre),
    image: backendGame.image_url || 'https://placehold.co/600x400/4A5568/FFFFFF/png?text=Game',
    originalPrice,
    currentPrice,
    discount,
    genres,
    isTrending: false, // Will be set by selectTrendingGames
    isDealOfDay: false, // Will be set by selectDealOfTheDay
  };
}

/**
 * Select the game with the highest discount as Deal of the Day
 */
export function selectDealOfTheDay(games: Game[]): Game | null {
  if (!games.length) return null;
  
  const sortedByDiscount = [...games].sort((a, b) => b.discount - a.discount);
  const dealOfDay = sortedByDiscount[0];
  
  return {
    ...dealOfDay,
    isDealOfDay: true,
  };
}

/**
 * Select trending games based on discount threshold
 */
export function selectTrendingGames(games: Game[], limit: number = 8): Game[] {
  return games
    .filter((g) => g.discount > 10 && !g.isDealOfDay)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit)
    .map((g) => ({ ...g, isTrending: true }));
}

