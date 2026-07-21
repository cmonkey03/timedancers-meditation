import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChimeProvider } from '@/hooks/chime-context';
import { useThemeColors } from '@/hooks/use-theme';
import { useCustomFonts } from '@/hooks/use-fonts';

export default function Layout() {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { fontsLoaded, fonts } = useCustomFonts();
  const bottomPad = Math.min(insets.bottom, 8); // clamp for compact spacing
  return (
    <ChimeProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.mutedText,
        tabBarStyle: {
          backgroundColor: C.surface,
          elevation: 0, // Android shadow off
          shadowOpacity: 0, // iOS shadow off
          borderTopWidth: 0.5,
          borderTopColor: C.border,
          // Bar must be >= item height to avoid clipping labels
          height: 66 + bottomPad,
          paddingTop: 0,
          paddingBottom: bottomPad + 2,
        },
        tabBarItemStyle: { height: 58, paddingVertical: 0 },
        tabBarLabelStyle: { 
          fontSize: 12, 
          lineHeight: 16, 
          fontFamily: fontsLoaded ? fonts.inter.medium : undefined,
          fontWeight: fontsLoaded ? undefined : '600', // fallback for when fonts aren't loaded
          marginTop: 0 
        },
      }}
    >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
              <Ionicons name="home-outline" size={size} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="meditate"
          options={{
            title: 'Meditate',
            tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
              <Ionicons name="aperture-outline" size={size} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
              <Ionicons name="settings-outline" size={size} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
              <Ionicons name="compass-outline" size={size} color={color as string} />
            ),
          }}
        />
    </Tabs>
    </ChimeProvider>
  );
}
