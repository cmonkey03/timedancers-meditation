import { useAlerts } from '@/hooks/use-alerts';
import { useThemeColors } from '@/hooks/use-theme';
import { useThemeOverride } from '@/hooks/theme-override';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const C = useThemeColors();
  const { override, setOverride } = useThemeOverride();
  const [minutes, setMinutes] = useState<string>('3');
  const [alertMode, setAlertMode] = useState<'chime' | 'chime_haptic' | 'haptic' | 'silent'>('chime');
  const [allowBackgroundAlerts, setAllowBackgroundAlerts] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>(''); // e.g., 08:00
  const { playPhaseTransitionAlert } = useAlerts(alertMode);

  useEffect(() => {
    (async () => {
      try {
        const m = await AsyncStorage.getItem('lastDurationMinutes');
        if (m) setMinutes(m);
        const am = await AsyncStorage.getItem('alertMode');
        if (am === 'chime' || am === 'chime_haptic' || am === 'haptic' || am === 'silent') setAlertMode(am);
        const bg = await AsyncStorage.getItem('allowBackgroundAlerts');
        if (bg === 'true' || bg === 'false') setAllowBackgroundAlerts(bg === 'true');
        const rt = await AsyncStorage.getItem('dailyReminderTime');
        if (rt) setReminderTime(rt);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('lastDurationMinutes', minutes).catch(() => {});
  }, [minutes]);
  useEffect(() => {
    AsyncStorage.setItem('alertMode', alertMode).catch(() => {});
  }, [alertMode]);
  useEffect(() => {
    AsyncStorage.setItem('allowBackgroundAlerts', allowBackgroundAlerts ? 'true' : 'false').catch(() => {});
  }, [allowBackgroundAlerts]);
  useEffect(() => {
    if (reminderTime) AsyncStorage.setItem('dailyReminderTime', reminderTime).catch(() => {});
  }, [reminderTime]);

  const resetDefaults = async () => {
    try {
      await AsyncStorage.multiRemove([
        'lastDurationMinutes',
        'alertMode',
        'allowBackgroundAlerts',
        'dailyReminderTime',
        'activeSessionEndAtMs',
        'themeOverride',
      ]);
    } catch {}
    setMinutes('3');
    setAlertMode('chime');
    setAllowBackgroundAlerts(true);
    setReminderTime('');
    setOverride(null); // back to System
  };

  const alertOptions: { key: 'chime' | 'chime_haptic' | 'haptic' | 'silent'; label: string }[] = [
    { key: 'chime', label: 'Chime' },
    { key: 'chime_haptic', label: 'Chime + Haptic' },
    { key: 'haptic', label: 'Haptic' },
    { key: 'silent', label: 'Silent' },
  ];

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: C.background }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 12 }}>Settings</Text>

      {/* Theme Preview */}
      <Text style={{ fontWeight: '600', color: C.text, marginBottom: 6 }}>Theme Preview</Text>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        {[
          { key: 'system', label: 'System' },
          { key: 'light', label: 'Light' },
          { key: 'dark', label: 'Dark' },
        ].map((opt) => {
          const selected =
            (opt.key === 'system' && override == null) ||
            (opt.key === 'light' && override === 'light') ||
            (opt.key === 'dark' && override === 'dark');
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setOverride(opt.key === 'system' ? null : (opt.key as 'light' | 'dark'))}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: selected ? C.primary : C.border,
                backgroundColor: selected ? C.surface : 'transparent',
                marginRight: 8,
              }}
              testID={`theme-${opt.key}`}
            >
              <Text style={{ color: C.text, fontWeight: selected ? '700' : '500' }}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Default Duration */}
      <Text style={{ fontWeight: '600', color: C.text }}>Default Duration (minutes)</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="Minutes"
        value={minutes}
        onChangeText={setMinutes}
        placeholderTextColor={C.mutedText}
        style={{
          borderColor: C.border, borderWidth: 1, borderRadius: 8,
          paddingHorizontal: 12, paddingVertical: 8, color: C.text, marginTop: 6, marginBottom: 16,
        }}
      />

      {/* Alert Mode */}
      <Text style={{ fontWeight: '600', color: C.text }}>Alert Mode</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, marginBottom: 16 }}>
        {alertOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setAlertMode(opt.key)}
            style={{
              paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
              borderColor: alertMode === opt.key ? C.primary : C.border,
              backgroundColor: alertMode === opt.key ? C.surface : 'transparent',
              marginRight: 8, marginBottom: 8,
            }}
          >
            <Text style={{ color: C.text, fontWeight: alertMode === opt.key ? '700' : '500' }}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Background Alerts Toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text style={{ color: C.text, fontWeight: '600' }}>Allow background alerts</Text>
        <Switch value={allowBackgroundAlerts} onValueChange={setAllowBackgroundAlerts} />
      </View>

      {/* Test Alert */}
      <TouchableOpacity onPress={() => playPhaseTransitionAlert()} style={{ marginBottom: 16, alignSelf: 'flex-start', backgroundColor: C.surface, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}>
        <Text style={{ color: C.text, fontWeight: '700' }}>Test Alert</Text>
      </TouchableOpacity>

      {/* Daily Reminder (simple HH:MM input for now) */}
      <Text style={{ fontWeight: '600', color: C.text }}>Daily Reminder (HH:MM)</Text>
      <TextInput
        keyboardType="numbers-and-punctuation"
        placeholder="08:00"
        value={reminderTime}
        onChangeText={setReminderTime}
        placeholderTextColor={C.mutedText}
        style={{
          borderColor: C.border, borderWidth: 1, borderRadius: 8,
          paddingHorizontal: 12, paddingVertical: 8, color: C.text, marginTop: 6, marginBottom: 8,
        }}
      />
      <Text style={{ color: C.mutedText, marginBottom: 24 }}>Reminders require notification permission and a dev/production build.</Text>

      {/* Reset to defaults */}
      <TouchableOpacity onPress={resetDefaults} style={{ marginBottom: 24, alignSelf: 'flex-start', backgroundColor: C.surface, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}>
        <Text style={{ color: C.text, fontWeight: '700' }}>Reset to defaults</Text>
      </TouchableOpacity>

    </View>
  );
}
