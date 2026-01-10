export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  genres: string[];
  isTrending: boolean;
  isDealOfDay: boolean;
}


