import TimePickerModal from '@/components/Settings/TimePickerModal';
import { uiText } from '@/data/ui-text';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { initNotifications } from '@/utils/notifications';
import { getDailyReminder, setDailyReminderEnabled } from '@/utils/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Pressable, Switch, Text, useColorScheme, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const TimeButton = ({ enabled, time, onPress }: { enabled: boolean; time: string; onPress: () => void }) => {
  const C = useThemeColors();
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
      accessibilityLabel={`Daily reminder time ${time || 'not set'}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !enabled }}
      accessibilityHint={enabled ? uiText.settings.dailyReminder.setTimeHint : uiText.settings.dailyReminder.enableToSetTime}
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
          {time || uiText.settings.dailyReminder.timePlaceholder}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function DailyReminder() {
  const C = useThemeColors();
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
      <Text style={{ fontWeight: '600', color: C.text, fontSize: 16 }}>{uiText.settings.sections.dailyReminder}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <Switch
          value={enabled}
          onValueChange={async (v) => {
            setEnabled(v);
            try {
              await initNotifications();
              const t = time || '08:00';
              const res = await setDailyReminderEnabled(v, t);
              if (v && t !== res.time) setTime(res.time);
            } catch {}
          }}
          testID="daily-reminder-switch"
          accessibilityLabel={uiText.settings.dailyReminder.enable}
          accessibilityHint={uiText.settings.dailyReminder.hint}
        />
        <View style={{ width: 16 }} />
        <TimeButton 
          enabled={enabled} 
          time={time} 
          onPress={() => enabled && setShowPicker(true)} 
        />
      </View>
      <Text style={{ color: C.text, opacity: 0.75, fontSize: 14 }}>{uiText.settings.dailyReminder.description}</Text>

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
              await initNotifications();
              await setDailyReminderEnabled(true, hhmm);
            }
          } catch {
            setShowPicker(false);
          }
        }}
      />
    </View>
  );
}
