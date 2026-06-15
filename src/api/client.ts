/**
 * Thin TMDB HTTP client. Pure request helpers only — no React, no caching,
 * no query logic (that lives in queries/ and hooks/).
 */

// Base URLs are overridable so the app can route through a proxy (e.g. a
// Cloudflare Worker) in regions where TMDB's own domains are blocked.
const BASE_URL = process.env.EXPO_PUBLIC_TMDB_API_BASE || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

const ACCESS_TOKEN = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;

export const isTmdbConfigured = Boolean(
  ACCESS_TOKEN && ACCESS_TOKEN !== 'your_tmdb_v4_read_access_token_here',
);

type QueryParams = Record<string, string | number | undefined>;

export async function tmdbGet<T>(path: string, params: QueryParams = {}): Promise<T> {
  if (!isTmdbConfigured) {
    throw new Error(
      'TMDB access token is missing. Add EXPO_PUBLIC_TMDB_ACCESS_TOKEN to your .env file.',
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status}) for ${path}`);
  }

  return response.json() as Promise<T>;
}

/** Build a poster image URL (vertical card art). */
export function posterUrl(path: string | null, size: 'w342' | 'w500' = 'w500') {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

/** Build a backdrop image URL (wide cinematic art). */
export function backdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

/** Build a cast/crew profile image URL. */
export function profileUrl(path: string | null) {
  return path ? `${IMAGE_BASE_URL}/w185${path}` : null;
}

/** Vidking embeddable player URL for a given TMDB movie id. */
export function vidkingEmbedUrl(movieId: number) {
  return `https://www.vidking.net/embed/movie/${movieId}`;
}
