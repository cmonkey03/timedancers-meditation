import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { useAlerts } from '@/hooks/use-alerts';
import type { AlertMode } from '@/hooks/use-notifications';

const MODES: { key: AlertMode; label: string }[] = [
  { key: 'chime', label: 'Chime' },
  { key: 'chime_haptic', label: 'Chime + Vibrate' },
  { key: 'haptic', label: 'Vibrate' },
  { key: 'silent', label: 'Silent' },
];

export default function AlertsSettings() {
  const C = useThemeColors();
  const [mode, setMode] = useState<AlertMode>('chime');
  const { playStartAlert } = useAlerts(mode);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('alertMode');
        if (saved === 'chime' || saved === 'chime_haptic' || saved === 'haptic' || saved === 'silent') {
          setMode(saved);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('alertMode', mode).catch(() => {});
  }, [mode]);

  const buttons = useMemo(
    () =>
      MODES.map((m) => {
        const selected = m.key === mode;
        return (
          <TouchableOpacity
            key={m.key}
            onPress={() => setMode(m.key)}
            style={[
              s.pill,
              {
                borderColor: selected ? C.primary : C.border,
                backgroundColor: selected ? C.background : 'transparent',
              },
            ]}
          >
            <Text style={{ color: C.text, fontWeight: selected ? '700' : '500' }}>{m.label}</Text>
          </TouchableOpacity>
        );
      }),
    [mode, C]
  );

  return (
    <View style={[s.card, { backgroundColor: C.surface }]}
    >
      <Text style={{ fontWeight: '600', color: C.text, marginBottom: 10 }}>Alerts</Text>
      <View style={s.row}>{buttons}</View>
      <Text style={{ color: C.mutedText, marginBottom: 12 }}>Choose how the app alerts you at start and completion.</Text>
      <TouchableOpacity
        onPress={() => playStartAlert()}
        style={[s.testBtn, { backgroundColor: C.surface, borderColor: C.border }]}
      >
        <Text style={{ color: C.text, fontWeight: '700' }}>Test alert</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  testBtn: {
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
