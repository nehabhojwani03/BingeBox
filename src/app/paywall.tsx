import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useStartSubscription } from '@/hooks/use-start-subscription';
import { useAuthStore } from '@/stores/auth-store';

const PLAN_BENEFITS = [
  'Unlimited streaming, ad-free',
  'Full HD playback on every title',
  'Watchlist & collections synced to your account',
  'Resume across all your devices',
];

const PLAN_PRICE = '₹149';
const PLAN_PERIOD = 'per month';

function Benefit({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
      <Text className="flex-1 text-base text-white">{label}</Text>
    </View>
  );
}

export default function PaywallScreen() {
  const signOut = useAuthStore((state) => state.signOut);
  const startSubscription = useStartSubscription();
  const busy = startSubscription.isPending;

  function handleSubscribe() {
    startSubscription.mutate(undefined, {
      onError: (error) => {
        Alert.alert('Subscription failed', error.message);
      },
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="mb-8 flex-row items-center gap-2">
          <Ionicons name="film" size={30} color={Colors.primary} />
          <Text className="text-3xl font-extrabold tracking-tight text-white">
            Binge<Text className="text-primary">Box</Text>
          </Text>
        </View>

        <Text className="mb-1 text-2xl font-extrabold text-white">Go Premium</Text>
        <Text className="mb-8 text-sm text-muted">
          Subscribe to unlock the full BingeBox experience.
        </Text>

        <View className="gap-4">
          {PLAN_BENEFITS.map((benefit) => (
            <Benefit key={benefit} label={benefit} />
          ))}
        </View>

        <View className="mt-8 flex-row items-end gap-1">
          <Text className="text-4xl font-extrabold text-white">{PLAN_PRICE}</Text>
          <Text className="mb-1 text-base text-muted">{PLAN_PERIOD}</Text>
        </View>

        <Pressable
          onPress={handleSubscribe}
          disabled={busy}
          className="mt-6 items-center justify-center rounded-2xl bg-primary py-4 active:opacity-80"
          style={{ opacity: busy ? 0.7 : 1 }}>
          {busy ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-base font-bold text-white">Subscribe</Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => signOut()}
          className="mt-5 flex-row justify-center active:opacity-70">
          <Text className="text-sm text-muted">
            Not now? <Text className="font-bold text-white">Sign out</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
