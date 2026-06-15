import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FEATURES = [
  { title: 'Expo Router', body: 'File-based routing — screens live in src/app.' },
  { title: 'NativeWind', body: 'Tailwind CSS classes via the className prop.' },
  { title: 'TypeScript', body: 'Strict mode and typed routes are enabled.' },
  { title: 'Dark mode', body: 'Use dark: variants — driven by the system scheme.' },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950" edges={['top']}>
      <ScrollView contentContainerClassName="gap-4 p-6">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-white">Explore</Text>
        <Text className="text-base text-neutral-500 dark:text-neutral-400">
          What is wired up in this starter.
        </Text>

        {FEATURES.map((f) => (
          <View
            key={f.title}
            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <Text className="text-base font-semibold text-brand">{f.title}</Text>
            <Text className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{f.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
