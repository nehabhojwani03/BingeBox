import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { MediaType } from '@/api/types';

export interface WatchlistItem {
  id: number;
  media_type: MediaType;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
}

interface WatchlistState {
  items: WatchlistItem[];
  toggle: (item: WatchlistItem) => void;
  remove: (id: number) => void;
  clear: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((existing) => existing.id === item.id);
        set({
          items: exists
            ? get().items.filter((existing) => existing.id !== item.id)
            : [item, ...get().items],
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
