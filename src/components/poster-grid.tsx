import { type ReactElement } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';

import { MovieCard } from '@/components/movie-card';

const COLUMNS = 3;
const H_PADDING = 16;
const GAP = 12;

interface PosterGridItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

interface PosterGridProps {
  movies: PosterGridItem[];
  onRemove?: (id: number) => void;
  ListHeaderComponent?: ReactElement;
  ListEmptyComponent?: ReactElement;
}

export function PosterGrid({
  movies,
  onRemove,
  ListHeaderComponent,
  ListEmptyComponent,
}: PosterGridProps) {
  const { width } = useWindowDimensions();
  const cardWidth = (width - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => String(item.id)}
      numColumns={COLUMNS}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      columnWrapperStyle={{ gap: GAP }}
      contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingBottom: 32, gap: GAP }}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          width={cardWidth}
          showMeta
          onRemove={onRemove ? () => onRemove(item.id) : undefined}
        />
      )}
    />
  );
}
