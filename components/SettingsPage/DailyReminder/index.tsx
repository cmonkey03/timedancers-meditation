import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Switch, Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import { initNotifications } from '@/utils/notifications';
import { getDailyReminder, setDailyReminderEnabled } from '@/utils/settings';
import { useThemeColors } from '@/hooks/use-theme';
import TimePickerSheet from '@/components/TimePickerSheet';

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
      <Text style={{ fontWeight: '600', color: C.text }}>Daily Reminder</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
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
        />
        <View style={{ width: 12 }} />
        <TouchableOpacity
          onPress={() => enabled && setShowPicker(true)}
          activeOpacity={enabled ? 0.7 : 1}
          style={{
            borderColor: C.border,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flex: 0.5,
            opacity: enabled ? 1 : 0.5,
          }}
          disabled={!enabled}
        >
          <Text style={{ color: C.text, fontWeight: '600' }}>{time || 'HH:MM'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ color: C.mutedText, marginBottom: 16 }}>Schedule a local notification (24-hour).</Text>

      {/* Bottom-sheet time picker */}
      <TimePickerSheet
        visible={showPicker}
        time={time || '08:00'}
        colorScheme={colorScheme}
        onCancel={() => setShowPicker(false)}
        onConfirm={async (hhmm) => {
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
