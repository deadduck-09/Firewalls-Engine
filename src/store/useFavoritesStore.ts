import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Wallpaper } from '@/types/wallpaper';

interface FavoritesState {
  favorites: Wallpaper[];
  addFavorite: (wallpaper: Wallpaper) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (wallpaper) =>
        set((state) => ({
          favorites: [...state.favorites, wallpaper],
        })),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((w) => w.id !== id),
        })),

      isFavorite: (id) =>
        get().favorites.some((w) => w.id === id),
    }),
    {
      name: 'firewalls-favorites',
    }
  )
);