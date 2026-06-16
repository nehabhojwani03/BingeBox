import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Movie } from '@/api/types';

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
}

interface WatchlistState {
  items: WatchlistItem[];
  toggle: (movie: Movie) => void;
  remove: (id: number) => void;
  clear: () => void;
}

function toItem(movie: Movie): WatchlistItem {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
  };
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (movie) => {
        const exists = get().items.some((item) => item.id === movie.id);
        set({
          items: exists
            ? get().items.filter((item) => item.id !== movie.id)
            : [toItem(movie), ...get().items],
        });
      },
      remove: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'bingebox-watchlist',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useIsInWatchlist(id: number) {
  return useWatchlistStore((state) => state.items.some((item) => item.id === id));
}
