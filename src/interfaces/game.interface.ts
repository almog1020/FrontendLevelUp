export interface PriceComparison {
  store: string;
  price: number;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

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
  rating?: number;
  reviewCount?: number;
  releaseDate?: string;
  difficulty?: number;
  platforms?: string[];
  storeName?: string;
  images?: string[];
  priceComparison?: PriceComparison[];
  reviews?: Review[];
}




