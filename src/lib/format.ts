/** Pure display formatters. Same input → same output, no side effects. */

/** "2024-05-17" → "2024". Empty/invalid → "". */
export function formatYear(releaseDate: string): string {
  if (!releaseDate) return '';
  return releaseDate.slice(0, 4);
}

/** "2024-05-17" → "May 17, 2024". Empty/invalid → "TBA". */
export function formatReleaseDate(releaseDate: string): string {
  if (!releaseDate) return 'TBA';
  const date = new Date(releaseDate);
  if (Number.isNaN(date.getTime())) return 'TBA';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** 142 → "2h 22m". 0/null → "". */
export function formatRuntime(minutes: number | null): string {
  if (!minutes || minutes <= 0) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/** 7.8421 → "7.8". 0 → "NR". */
export function formatRating(voteAverage: number): string {
  if (!voteAverage || voteAverage <= 0) return 'NR';
  return voteAverage.toFixed(1);
}
