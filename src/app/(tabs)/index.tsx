import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isTmdbConfigured } from '@/api/client';
import { ContinueWatchingRow } from '@/components/continue-watching-row';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { HeroBanner } from '@/components/hero-banner';
import { MovieCarousel } from '@/components/movie-carousel';
import { Colors } from '@/constants/theme';
import {
  usePopularMovies,
  useTopRatedMovies,
  useTrendingMovies,
  useUpcomingMovies,
} from '@/hooks/use-movies';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const trending = useTrendingMovies();
  const popular = usePopularMovies();
  const topRated = useTopRatedMovies();
  const upcoming = useUpcomingMovies();

  if (!isTmdbConfigured) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <EmptyState
          icon="key-outline"
          title="Add your TMDB token"
          message="Set EXPO_PUBLIC_TMDB_ACCESS_TOKEN in your .env file (a free TMDB v4 read access token), then restart the dev server."
        />
      </View>
    );
  }

  if (trending.isError) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <ErrorState message={trending.error?.message} onRetry={() => trending.refetch()} />
      </View>
    );
  }

  const featured = trending.data?.results?.[0];

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <HeroBanner movie={featured} isLoading={trending.isLoading} />

        <View className="pt-6">
          <ContinueWatchingRow />
          <MovieCarousel
            title="Trending Now"
            movies={trending.data?.results?.slice(1)}
            isLoading={trending.isLoading}
          />
          <MovieCarousel
            title="Popular"
            movies={popular.data?.results}
            isLoading={popular.isLoading}
          />
          <MovieCarousel
            title="Top Rated"
            movies={topRated.data?.results}
            isLoading={topRated.isLoading}
          />
          <MovieCarousel
            title="Upcoming"
            movies={upcoming.data?.results}
            isLoading={upcoming.isLoading}
          />
        </View>
      </ScrollView>

      {/* Floating brand wordmark over the hero */}
      <View
        pointerEvents="none"
        className="absolute inset-x-0 top-0 flex-row items-center gap-2 px-5"
        style={{ paddingTop: insets.top + 8 }}>
        <Ionicons name="film" size={22} color={Colors.primary} />
        <Text className="text-xl font-extrabold tracking-tight text-white">
          Binge<Text className="text-primary">Box</Text>
        </Text>
      </View>
    </View>
  );
}
