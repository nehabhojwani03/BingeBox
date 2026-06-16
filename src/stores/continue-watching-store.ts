import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Movie } from '@/api/types';

export interface ContinueWatchingItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  currentTime: number;
  duration: number;
  progress: number;
  updatedAt: number;
}

export interface PlaybackProgress {
  currentTime: number;
  duration: number;
  progress: number;
}

const MIN_PROGRESS_SECONDS = 10;
const FINISHED_THRESHOLD = 0.95;

interface ContinueWatchingState {
  items: ContinueWatchingItem[];
  upsert: (movie: Movie, playback: PlaybackProgress) => void;
  remove: (id: number) => void;
  clear: () => void;
}

export const useContinueWatchingStore = create<ContinueWatchingState>()(
  persist(
    (set, get) => ({
      items: [],
      upsert: (movie, playback) => {
        const others = get().items.filter((item) => item.id !== movie.id);

        if (playback.currentTime < MIN_PROGRESS_SECONDS || playback.progress >= FINISHED_THRESHOLD) {
          set({ items: others });
          return;
        }

        const entry: ContinueWatchingItem = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          currentTime: playback.currentTime,
          duration: playback.duration,
          progress: playback.progress,
          updatedAt: Date.now(),
        };

        set({ items: [entry, ...others] });
      },
      remove: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'bingebox-continue-watching',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useResumePosition(id: number) {
  return useContinueWatchingStore(
    (state) => state.items.find((item) => item.id === id)?.currentTime ?? 0,
  );
}
