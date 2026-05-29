export interface Wallpaper {
  id: string;
  url: string;
  path: string;
  thumbs: {
    large: string;
    original: string;
  };
  resolution: string;
  ratio: string;
  category: string;
  colors: string[];
  views?: number;
  favorites?: number;
  isCurated?: boolean;
  curatedVibe?: string;
}

export interface WallhavenResponse {
  data: Array<{
    id: string;
    url: string;
    path: string;
    thumbs: {
      large: string;
      original: string;
    };
    resolution: string;
    ratio: string;
    category: string;
    colors: string[];
    views: number;
    favorites: number;
  }>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}