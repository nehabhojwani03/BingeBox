import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <View className="h-20 w-20 items-center justify-center rounded-3xl bg-brand">
          <Text className="text-3xl">🍿</Text>
        </View>

        <Text className="text-3xl font-bold text-neutral-900 dark:text-white">
          Welcome to Bingebox
        </Text>

        <Text className="text-center text-base text-neutral-500 dark:text-neutral-400">
          Styled with NativeWind (Tailwind) and routed with Expo Router.
        </Text>

        <Link href="/explore" asChild>
          <Pressable className="mt-2 rounded-full bg-brand px-6 py-3 active:opacity-80">
            <Text className="text-base font-semibold text-white">Get started</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
