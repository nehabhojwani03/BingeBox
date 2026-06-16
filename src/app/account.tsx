import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/stores/auth-store';

export default function AccountScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const displayName = (user?.user_metadata?.display_name as string) || 'BingeBox User';
  const email = user?.email ?? '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-5 pb-2 pt-2">
        <Pressable onPress={() => router.back()} hitSlop={8} className="active:opacity-70">
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </Pressable>
        <Text className="text-2xl font-extrabold text-white">Account</Text>
      </View>

      <View className="items-center gap-3 px-5 py-8">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-primary">
          <Text className="text-4xl font-extrabold text-white">{initial}</Text>
        </View>
        <Text className="text-xl font-bold text-white">{displayName}</Text>
        {email ? <Text className="text-sm text-muted">{email}</Text> : null}
      </View>

      <View className="mt-4 px-5">
        <Pressable
          onPress={signOut}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-elevated py-4 active:opacity-70">
          <Ionicons name="log-out-outline" size={20} color={Colors.primary} />
          <Text className="text-base font-bold text-primary">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
