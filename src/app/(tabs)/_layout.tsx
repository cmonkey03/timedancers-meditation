import { useI18n } from '@/contexts/I18nContext';
import { ChimeProvider } from '@/hooks/chime-context';
import { useCustomFonts } from '@/hooks/ui/use-fonts';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Layout() {
  const insets = useSafeAreaInsets();
  const C = useThemeColors();
  const { t } = useI18n();
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
            title: t('tabs.home'),
            tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
              <Ionicons name="home-outline" size={size} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="session"
          options={{
            title: t('tabs.session'),
            tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
              <Ionicons name="aperture-outline" size={size} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('tabs.settings'),
            tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
              <Ionicons name="settings-outline" size={size} color={color as string} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: t('tabs.explore'),
            tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
              <Ionicons name="compass-outline" size={size} color={color as string} />
            ),
          }}
        />
    </Tabs>
    </ChimeProvider>
  );
}
