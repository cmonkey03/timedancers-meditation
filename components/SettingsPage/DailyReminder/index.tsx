import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Switch, Text, TextInput, View } from 'react-native';
import { initNotifications } from '@/utils/notifications';
import { getDailyReminder, setDailyReminderEnabled } from '@/utils/settings';
import { useThemeColors } from '@/hooks/use-theme';

export default function DailyReminder() {
  const C = useThemeColors();
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    (async () => {
      const dr = await getDailyReminder();
      setEnabled(Boolean(dr.enabled));
      setTime(dr.time || '');
    })();
  }, []);

  return (
    <View>
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
        <TextInput
          keyboardType="numbers-and-punctuation"
          placeholder="HH:MM"
          value={time}
          onChangeText={async (t) => {
            setTime(t);
            await AsyncStorage.setItem('dailyReminderTime', t).catch(() => {});
            if (enabled) {
              try {
                await initNotifications();
                await setDailyReminderEnabled(true, t);
              } catch {}
            }
          }}
          placeholderTextColor={C.mutedText}
          style={{ borderColor: C.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: C.text, flex: 0.5 }}
          blurOnSubmit
        />
      </View>
      <Text style={{ color: C.mutedText, marginBottom: 16 }}>Enable and set a local reminder time (24h HH:MM).</Text>
    </View>
  );
}
