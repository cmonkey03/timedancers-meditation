import Button from '@/components/Button';
import { useAlerts } from '@/hooks/use-alerts';
import type { AlertMode } from '@/hooks/use-notifications';
import { useThemeColors } from '@/hooks/use-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const MODES: { key: AlertMode; label: string }[] = [
  { key: 'chime', label: 'Chime' },
  { key: 'chime_haptic', label: 'Chime + Vibrate' },
  { key: 'haptic', label: 'Vibrate' },
  { key: 'silent', label: 'Silent' },
];

type Props = {
  allowBackgroundAlerts: boolean;
  onToggleAllowBackgroundAlerts: (v: boolean) => void;
};

export default function AlertsSettings({ allowBackgroundAlerts, onToggleAllowBackgroundAlerts }: Props) {
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
      <Text style={{ color: C.mutedText, marginBottom: 8 }}>Choose how the app alerts you throughout your session.</Text>

      <View style={{ alignSelf: 'flex-start', marginTop: 4, marginBottom: 12 }}>
        <Button
          onPress={() => playStartAlert()}
          text="Test alert"
          variant="ghost"
        />
      </View>

      {/* Play alerts in background toggle */}
      <View style={[s.bgToggleRow, { borderColor: C.border }]}>
        <Text style={{ color: C.text, fontWeight: '600' }}>Play alerts in background</Text>
        <Switch value={allowBackgroundAlerts} onValueChange={onToggleAllowBackgroundAlerts} />
      </View>
      <Text style={{ color: C.mutedText, marginTop: 6, marginBottom: 12 }}>
        Chimes & haptics still play if the app is in the background or the screen is locked.
      </Text>

    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  bgToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
});
