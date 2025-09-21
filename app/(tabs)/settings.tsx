import { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColors } from '@/hooks/use-theme';
import DismissKeyboard from '@/components/DismissKeyboard';
import { ThemePreview, DailyReminder } from '@/components/SettingsPage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const C = useThemeColors();
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
    <DismissKeyboard>
      <ScrollView
        style={{ flex: 1, backgroundColor: C.background }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: insets.bottom + 20 }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 12 }}>Settings</Text>

        <ThemePreview />
        <DailyReminder />

        {/* Background Alerts Toggle */}
        <Text style={{ fontWeight: '600', color: C.text, marginBottom: 6 }}>Allow background alerts</Text>
        <Switch value={allowBackgroundAlerts} onValueChange={setAllowBackgroundAlerts} />

        {/* Reset to defaults */}
        <TouchableOpacity
          onPress={resetDefaults}
          style={{
            marginTop: 24,
            alignSelf: 'flex-start',
            backgroundColor: C.surface,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: C.text, fontWeight: '700' }}>Reset to defaults</Text>
        </TouchableOpacity>
      </ScrollView>
    </DismissKeyboard>
  );
}
