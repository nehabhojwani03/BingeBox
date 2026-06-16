import { QueryClientProvider } from '@tanstack/react-query';
import {
  DarkTheme,
  Stack,
  ThemeProvider,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@/global.css';

import { Colors } from '@/constants/theme';
import { useDataSync } from '@/hooks/use-data-sync';
import { queryClient } from '@/lib/query-client';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.background,
    card: Colors.background,
    text: Colors.text,
    border: Colors.border,
    primary: Colors.primary,
  },
};

function useAuthGate() {
  const status = useAuthStore((state) => state.status);
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  useEffect(() => {
    if (!navigationState?.key) return;
    if (!isSupabaseConfigured || status === 'loading') return;
    const inAuthScreen = segments[0] === 'auth';
    if (status === 'unauthenticated' && !inAuthScreen) {
      router.replace('/auth');
    } else if (status === 'authenticated' && inAuthScreen) {
      router.replace('/');
    }
  }, [status, segments, router, navigationState?.key]);
}

export default function RootLayout() {
  useAuthGate();
  useDataSync();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={navigationTheme}>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
              }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="movie/[id]" />
              <Stack.Screen name="tv/[id]" />
              <Stack.Screen name="collection/[id]" />
              <Stack.Screen name="account" />
              <Stack.Screen name="auth" options={{ animation: 'fade' }} />
              <Stack.Screen
                name="player/[id]"
                options={{ presentation: 'modal', animation: 'fade' }}
              />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
