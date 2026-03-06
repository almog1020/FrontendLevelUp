export interface WishlistItem {
  // Backend minimal shape: external_game_id OR game_id.
  external_game_id?: string;
  game_id?: string;
  id?: string;
  title?: string;
  thumb?: string | null;
  created_at?: string;
}

export interface WishlistGame {
  id: string;
  title: string;
  image?: string | null;
  price?: number | null;
  genres?: string[];
  dealUrl?: string | null;
  createdAt?: string;
}

export interface WishlistGameInput {
  id: string;
  title?: string;
  image?: string | null;
  createdAt?: string;
}
