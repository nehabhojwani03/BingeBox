import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { vidkingEmbedUrl } from '@/api/client';
import { ErrorState } from '@/components/error-state';
import { Colors } from '@/constants/theme';

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" hidden />

      {failed ? (
        <ErrorState
          message="This title could not be played right now."
          onRetry={() => {
            setFailed(false);
            setLoading(true);
          }}
        />
      ) : (
        <WebView
          source={{ uri: vidkingEmbedUrl(movieId) }}
          style={{ flex: 1, backgroundColor: '#000' }}
          allowsInlineMediaPlayback
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setFailed(true);
          }}
        />
      )}

      {loading && !failed && (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      )}

      <Pressable
        onPress={() => router.back()}
        className="absolute right-4 h-10 w-10 items-center justify-center rounded-full bg-black/70 active:opacity-70"
        style={{ top: insets.top + 8 }}>
        <Ionicons name="close" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
