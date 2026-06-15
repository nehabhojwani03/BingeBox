import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { PosterGrid } from '@/components/poster-grid';
import { useWatchlistStore } from '@/stores/watchlist-store';

export default function WatchlistScreen() {
  const items = useWatchlistStore((state) => state.items);
  const remove = useWatchlistStore((state) => state.remove);

  const header = (
    <View className="px-4 pb-4 pt-2">
      <Text className="text-2xl font-extrabold text-white">My Watchlist</Text>
      <Text className="mt-1 text-sm text-muted">
        {items.length} {items.length === 1 ? 'movie' : 'movies'} saved
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {items.length === 0 ? (
        <View className="flex-1">
          {header}
          <EmptyState
            icon="bookmark-outline"
            title="Your watchlist is empty"
            message="Tap the bookmark on any movie to save it here for later."
          />
        </View>
      ) : (
        <PosterGrid movies={items} onRemove={remove} ListHeaderComponent={header} />
      )}
    </SafeAreaView>
  );
}
