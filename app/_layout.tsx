// MUST be the very first import (fixes silent iOS crashes)
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// eslint-disable-next-line import/no-duplicates
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeOverrideProvider } from '@/hooks/theme-override';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeOverrideProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
            <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaView>
        </ThemeOverrideProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
