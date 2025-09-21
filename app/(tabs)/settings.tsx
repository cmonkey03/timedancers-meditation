import { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, Linking } from 'react-native';
import { useAlerts } from '@/hooks/use-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
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
      ]);
    } catch {}
    setMinutes('3');
    setAlertMode('chime');
    setAllowBackgroundAlerts(true);
    setReminderTime('');
  };

  const alertOptions: { key: 'chime' | 'chime_haptic' | 'haptic' | 'silent'; label: string }[] = [
    { key: 'chime', label: 'Chime' },
    { key: 'chime_haptic', label: 'Chime + Haptic' },
    { key: 'haptic', label: 'Haptic' },
    { key: 'silent', label: 'Silent' },
  ];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#1a5632', marginBottom: 12 }}>Settings</Text>

      {/* Default Duration */}
      <Text style={{ fontWeight: '600', color: '#1a5632' }}>Default Duration (minutes)</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="Minutes"
        value={minutes}
        onChangeText={setMinutes}
        placeholderTextColor="#1a5632"
        style={{
          borderColor: '#1a5632', borderWidth: 1, borderRadius: 8,
          paddingHorizontal: 12, paddingVertical: 8, color: '#1a5632', marginTop: 6, marginBottom: 16,
        }}
      />

      {/* Alert Mode */}
      <Text style={{ fontWeight: '600', color: '#1a5632' }}>Alert Mode</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, marginBottom: 16 }}>
        {alertOptions.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setAlertMode(opt.key)}
            style={{
              paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
              borderColor: alertMode === opt.key ? '#1a5632' : '#cbd5d1',
              backgroundColor: alertMode === opt.key ? '#e4ede7' : '#fff',
              marginRight: 8, marginBottom: 8,
            }}
          >
            <Text style={{ color: '#1a5632', fontWeight: alertMode === opt.key ? '700' : '500' }}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Background Alerts Toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text style={{ color: '#1a5632', fontWeight: '600' }}>Allow background alerts</Text>
        <Switch value={allowBackgroundAlerts} onValueChange={setAllowBackgroundAlerts} />
      </View>

      {/* Test Alert */}
      <TouchableOpacity onPress={() => playPhaseTransitionAlert()} style={{ marginBottom: 16, alignSelf: 'flex-start', backgroundColor: '#e4ede7', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}>
        <Text style={{ color: '#1a5632', fontWeight: '700' }}>Test Alert</Text>
      </TouchableOpacity>

      {/* Daily Reminder (simple HH:MM input for now) */}
      <Text style={{ fontWeight: '600', color: '#1a5632' }}>Daily Reminder (HH:MM)</Text>
      <TextInput
        keyboardType="numbers-and-punctuation"
        placeholder="08:00"
        value={reminderTime}
        onChangeText={setReminderTime}
        placeholderTextColor="#1a5632"
        style={{
          borderColor: '#1a5632', borderWidth: 1, borderRadius: 8,
          paddingHorizontal: 12, paddingVertical: 8, color: '#1a5632', marginTop: 6, marginBottom: 8,
        }}
      />
      <Text style={{ color: '#4b6356', marginBottom: 24 }}>Reminders require notification permission and a dev/production build.</Text>

      {/* Reset to defaults */}
      <TouchableOpacity onPress={resetDefaults} style={{ marginBottom: 24, alignSelf: 'flex-start', backgroundColor: '#e4ede7', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 }}>
        <Text style={{ color: '#1a5632', fontWeight: '700' }}>Reset to defaults</Text>
      </TouchableOpacity>

      {/* Explore link */}
      <TouchableOpacity onPress={() => Linking.openURL('https://timedancers.org')}>
        <Text style={{ color: '#1a5632', fontWeight: '700' }}>Visit timedancers.org</Text>
      </TouchableOpacity>
    </View>
  );
}
