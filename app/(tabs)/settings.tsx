import { DailyReminder, ThemePreview } from '@/components/SettingsPage';
import Alerts from '@/components/SettingsPage/Alerts';
import Button from '@/components/Button';
import { useThemeColors } from '@/hooks/use-theme';
import { useCustomFonts } from '@/hooks/use-fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const C = useThemeColors();
  const { fontsLoaded, fonts } = useCustomFonts();
  const insets = useSafeAreaInsets();
  const [allowBackgroundAlerts, setAllowBackgroundAlerts] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const savedAllowBg = await AsyncStorage.getItem('allowBackgroundAlerts');
        if (savedAllowBg === 'true' || savedAllowBg === 'false') {
          setAllowBackgroundAlerts(savedAllowBg === 'true');
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('allowBackgroundAlerts', allowBackgroundAlerts ? 'true' : 'false').catch(() => {});
  }, [allowBackgroundAlerts]);

  const resetDefaults = async () => {
    try {
      await AsyncStorage.multiRemove([
        'lastDurationMinutes',
        'alertMode',
        'allowBackgroundAlerts',
        'dailyReminderTime',
        'dailyReminderId',
        'activeSessionEndAtMs',
        'themeOverride',
      ]);
      setAllowBackgroundAlerts(true);
    } catch {}
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.background }} testID="screen-settings">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: insets.bottom + 20 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
      <Text style={{ 
        fontSize: 22, 
        fontFamily: fontsLoaded ? fonts.cinzel.regular : undefined,
        fontWeight: fontsLoaded ? undefined : '700', 
        color: C.text, 
        marginBottom: 12,
        letterSpacing: 0.5,
      }}>Settings</Text>

      <ThemePreview />
      <Alerts
        allowBackgroundAlerts={allowBackgroundAlerts}
        onToggleAllowBackgroundAlerts={setAllowBackgroundAlerts}
      />
      <DailyReminder />

      {/* Reset to defaults */}
      <View style={{ marginTop: 8, alignSelf: 'flex-start' }}>
        <Button
          onPress={resetDefaults}
          text="Reset to defaults"
          variant="ghost"
          testID="reset-defaults-button"
        />
      </View>
      </ScrollView>
    </View>
  );
}
