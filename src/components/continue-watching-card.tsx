import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { type DimensionValue, Pressable, Text, View } from 'react-native';

import { backdropUrl, posterUrl } from '@/api/client';
import { Colors } from '@/constants/theme';
import type { ContinueWatchingItem } from '@/stores/continue-watching-store';

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
  width: number;
  onRemove: () => void;
}

export function ContinueWatchingCard({ item, width, onRemove }: ContinueWatchingCardProps) {
  const router = useRouter();
  const uri = backdropUrl(item.backdrop_path, 'w780') ?? posterUrl(item.poster_path);
  const progressPercent = `${Math.min(100, Math.round(item.progress * 100))}%` as DimensionValue;

  return (
    <Pressable
      onPress={() => router.push(`/player/${item.id}`)}
      className="active:opacity-80"
      style={{ width }}>
      <View
        className="overflow-hidden rounded-xl bg-elevated"
        style={{ aspectRatio: 16 / 9 }}>
        {uri ? (
          <Image source={{ uri }} style={{ flex: 1 }} contentFit="cover" transition={200} />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="film-outline" size={28} color={Colors.textSecondary} />
          </View>
        )}

        {/* Play affordance */}
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-black/55">
            <Ionicons name="play" size={22} color="#FFFFFF" />
          </View>
        </View>

        {/* Remove */}
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          className="absolute right-1.5 top-1.5 h-7 w-7 items-center justify-center rounded-full bg-black/70 active:opacity-70">
          <Ionicons name="close" size={15} color="#FFFFFF" />
        </Pressable>

        {/* Progress bar */}
        <View className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
          <View className="h-full bg-primary" style={{ width: progressPercent }} />
        </View>
      </View>

      <Text numberOfLines={1} className="mt-2 text-sm font-semibold text-white">
        {item.title}
      </Text>
    </Pressable>
  );
}
