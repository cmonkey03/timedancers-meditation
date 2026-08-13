import Button from '@/components/Button';
import { DailyReminder, ThemePreview } from '@/components/Settings';
import Alerts from '@/components/Settings/Alerts';
import LanguageSelector from '@/components/Settings/LanguageSelector';
import { useI18n } from '@/contexts/I18nContext';
import { useCustomFonts } from '@/hooks/ui/use-fonts';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { settingsService } from '@/services/settings';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const C = useThemeColors();
  const { t } = useI18n();
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
      }}>{t('settings.title')}</Text>

      <ThemePreview />
      <Alerts
        allowBackgroundAlerts={allowBackgroundAlerts}
        onToggleAllowBackgroundAlerts={setAllowBackgroundAlerts}
      />
      <DailyReminder />

      {/* Language Selector */}
      <View
        style={{
          backgroundColor: C.surface,
          borderRadius: 12,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontWeight: '600', color: C.text, marginBottom: 10, fontSize: 16 }}>{t('settings.language.title')}</Text>
        <LanguageSelector />
      </View>

      {/* Reset to defaults */}
      <View style={{ marginTop: 8, alignSelf: 'flex-start' }}>
        <Button
          onPress={resetDefaults}
          text={t('settings.buttons.resetToDefaults')}
          variant="ghost"
          testID="reset-defaults-button"
        />
      </View>
      </ScrollView>
    </View>
  );
}
