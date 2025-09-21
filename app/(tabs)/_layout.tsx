import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme';

// Create a Tabs component backed by Material Top Tabs (native swipe)
const { Navigator } = createMaterialTopTabNavigator();
export const Tabs = withLayoutContext(Navigator);

export default function Layout() {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  return (
    <Tabs
      tabBarPosition="bottom"
      screenOptions={{
        swipeEnabled: true,
        tabBarScrollEnabled: false,
        tabBarShowIcon: true,
        tabBarShowLabel: false,
        tabBarIndicatorStyle: { backgroundColor: C.primary, height: 1 },
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.mutedText,
        tabBarStyle: {
          backgroundColor: C.surface,
          elevation: 0, // Android shadow off
          shadowOpacity: 0, // iOS shadow off
          borderTopWidth: 0.5,
          borderTopColor: C.border,
          // Tighter bar sizing
          height: 44 + insets.bottom,
          paddingTop: 2,
          paddingBottom: insets.bottom,
        },
        tabBarItemStyle: { height: 38, paddingVertical: 0 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="meditate"
          options={{
            title: 'Meditate',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="timer-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="settings-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="compass-outline" size={24} color={color} />
            ),
          }}
        />
    </Tabs>
  );
}
