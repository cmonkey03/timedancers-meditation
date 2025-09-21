import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import React from 'react';

// Create a Tabs component backed by Material Top Tabs (native swipe)
const { Navigator } = createMaterialTopTabNavigator();
export const Tabs = withLayoutContext(Navigator);

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        swipeEnabled: true,
        tabBarScrollEnabled: false,
        tabBarShowIcon: true,
        tabBarIndicatorStyle: { backgroundColor: '#1a5632', height: 2 },
        tabBarActiveTintColor: '#1a5632',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="home-outline" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="meditate"
          options={{
            title: 'Meditate',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="timer-outline" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="settings-outline" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }: { color: string }) => (
              <Ionicons name="compass-outline" size={20} color={color} />
            ),
          }}
        />
    </Tabs>
  );
}
