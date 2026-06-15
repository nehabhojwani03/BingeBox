/**
 * Pure TMDB movie API functions. Each takes input and returns data — no state,
 * no query/caching logic. Consumed by the query key store in queries/.
 */
import { tmdbGet } from '@/api/client';
import type { MovieDetails, Movie, Paginated } from '@/api/types';

export const moviesApi = {
  trending: () => tmdbGet<Paginated<Movie>>('/trending/movie/week'),

  popular: () => tmdbGet<Paginated<Movie>>('/movie/popular'),

  topRated: () => tmdbGet<Paginated<Movie>>('/movie/top_rated'),

  upcoming: () => tmdbGet<Paginated<Movie>>('/movie/upcoming'),

  search: (query: string) =>
    tmdbGet<Paginated<Movie>>('/search/movie', { query, include_adult: 'false' }),

  detail: (id: number) =>
    tmdbGet<MovieDetails>(`/movie/${id}`, { append_to_response: 'credits,similar' }),
};
