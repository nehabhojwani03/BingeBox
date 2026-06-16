import { useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { PosterGrid } from '@/components/poster-grid';
import { SearchBar } from '@/components/search-bar';
import { Colors } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useSearchMulti } from '@/hooks/use-search';
import { multiToCards } from '@/lib/media';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 400);
  const trimmed = debouncedQuery.trim();
  const { data, isLoading, isError, error, refetch } = useSearchMulti(trimmed);

  const results = useMemo(() => multiToCards(data?.results ?? []), [data]);

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
          message="Search movies and TV shows by title, franchise, or keyword."
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

    if (results.length === 0) {
      return (
        <EmptyState
          icon="sad-outline"
          title="No results found"
          message={`We couldn’t find anything matching “${trimmed}”.`}
        />
      );
    }

    return null;
  }

  const body = renderBody();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {body ? (
        <View className="flex-1">
          <View className="px-4 pt-2">{header}</View>
          {body}
        </View>
      ) : (
        <PosterGrid movies={results} ListHeaderComponent={<View className="pt-2">{header}</View>} />
      )}
    </SafeAreaView>
  );
}
