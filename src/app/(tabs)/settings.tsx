import Button from '@/components/Button';
import { DailyReminder, ThemePreview } from '@/components/Settings';
import Alerts from '@/components/Settings/Alerts';
import { uiText } from '@/data/ui-text';
import { useCustomFonts } from '@/hooks/ui/use-fonts';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { settingsService } from '@/services/settings';
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
        const savedAllowBg = await settingsService.getAllowBackgroundAlerts();
        setAllowBackgroundAlerts(savedAllowBg);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    settingsService.setAllowBackgroundAlerts(allowBackgroundAlerts);
  }, [allowBackgroundAlerts]);

  const resetDefaults = async () => {
    try {
      await settingsService.resetToDefaults();
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
      }}>{uiText.settings.title}</Text>

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
          text={uiText.settings.buttons.resetToDefaults}
          variant="ghost"
          testID="reset-defaults-button"
        />
      </View>
      </ScrollView>
    </View>
  );
}
