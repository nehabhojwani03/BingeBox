import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { PosterGrid } from '@/components/poster-grid';
import { SearchBar } from '@/components/search-bar';
import { Colors } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useSearchMovies } from '@/hooks/use-movies';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 400);
  const trimmed = debouncedQuery.trim();
  const { data, isLoading, isError, error, refetch } = useSearchMovies(trimmed);

  const header = (
    <View className="pb-4">
      <Text className="mb-4 text-2xl font-extrabold text-white">Search</Text>
      <SearchBar value={query} onChangeText={setQuery} />
    </View>
  );

  function renderBody() {
    if (trimmed.length === 0) {
      return (
        <EmptyState
          icon="search-outline"
          title="Find something to watch"
          message="Search thousands of movies by title, franchise, or keyword."
        />
      );
    }

    if (isLoading) {
      return (
        <View className="items-center justify-center py-24">
          <ActivityIndicator color={Colors.primary} />
        </View>
      );
    }

    if (isError) {
      return <ErrorState message={error?.message} onRetry={() => refetch()} />;
    }

    const results = data?.results ?? [];
    if (results.length === 0) {
      return (
        <EmptyState
          icon="sad-outline"
          title="No results found"
          message={`We couldn’t find any movies matching “${trimmed}”.`}
        />
      );
    }

    return null;
  }

  const body = renderBody();
  const results = trimmed.length > 0 && !isLoading && !isError ? (data?.results ?? []) : [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {body ? (
        <View className="flex-1">
          <View className="px-4 pt-2">{header}</View>
          {body}
        </View>
      ) : (
        <PosterGrid
          movies={results}
          ListHeaderComponent={<View className="pt-2">{header}</View>}
        />
      )}
    </SafeAreaView>
  );
}
