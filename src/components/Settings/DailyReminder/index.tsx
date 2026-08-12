import TimePickerModal from '@/components/Settings/TimePickerModal';
import { useI18n } from '@/contexts/I18nContext';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { initNotifications } from '@/utils/notifications';
import { getDailyReminder, setDailyReminderEnabled } from '@/utils/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Pressable, Switch, Text, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const TimeButton = ({ enabled, time, onPress }: { enabled: boolean; time: string; onPress: () => void }) => {
  const C = useThemeColors();
  const { t } = useI18n();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (enabled) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (enabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!enabled}
      testID="daily-reminder-time-button"
      accessibilityLabel={`${t('settings.dailyReminder.timeAccessibilityLabel')} ${time || t('settings.dailyReminder.notSet')}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !enabled }}
      accessibilityHint={enabled ? t('settings.dailyReminder.setTimeHint') : t('settings.dailyReminder.enableToSetTime')}
    >
      <Animated.View
        style={[
          {
            borderColor: enabled ? C.text60 : C.text30,
            borderWidth: 2,
            borderRadius: 22,
            paddingHorizontal: 18,
            paddingVertical: 12,
            flex: 0.5,
            opacity: enabled ? 1 : 0.5,
            shadowColor: C.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: enabled ? 0.05 : 0,
            shadowRadius: 2,
            elevation: enabled ? 1 : 0,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ 
          color: C.text, 
          fontWeight: '600',
          fontSize: 16,
        }}>
          {time || t('settings.dailyReminder.timePlaceholder')}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function DailyReminder() {
  const C = useThemeColors();
  const { t, locale } = useI18n();
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      const dr = await getDailyReminder();
      setEnabled(Boolean(dr.enabled));
      setTime(dr.time || '');
    })();
  }, []);

  return (
    <View
      style={{
        backgroundColor: C.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <Text style={{ fontWeight: '600', color: C.text, fontSize: 16 }}>{t('settings.sections.dailyReminder')}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <Switch
          value={enabled}
          onValueChange={async (v) => {
            setEnabled(v);
            try {
              await initNotifications(locale);
              const nextTime = time || '08:00';
              const res = await setDailyReminderEnabled(v, nextTime, t('notifications.dailyReminderBody'));
              if (v && nextTime !== res.time) setTime(res.time);
            } catch {}
          }}
          testID="daily-reminder-switch"
          accessibilityLabel={t('settings.dailyReminder.enable')}
          accessibilityHint={t('settings.dailyReminder.hint')}
        />
        <View style={{ width: 16 }} />
        <TimeButton 
          enabled={enabled} 
          time={time} 
          onPress={() => enabled && setShowPicker(true)} 
        />
      </View>
      <Text style={{ color: C.text, opacity: 0.75, fontSize: 14 }}>{t('settings.dailyReminder.description')}</Text>

      {/* Bottom-sheet time picker */}
      <TimePickerModal
        visible={showPicker}
        time={time || '08:00'}
        colorScheme={colorScheme}
        onCancel={() => setShowPicker(false)}
        onConfirm={async (hhmm: string) => {
          try {
            setTime(hhmm);
            await AsyncStorage.setItem('dailyReminderTime', hhmm).catch(() => {});
            setShowPicker(false);
            if (enabled) {
              await initNotifications(locale);
              await setDailyReminderEnabled(true, hhmm, t('notifications.dailyReminderBody'));
            }
          } catch {
            setShowPicker(false);
          }
        }}
      />
    </View>
  );
}
