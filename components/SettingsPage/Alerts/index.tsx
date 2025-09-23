import { useAlerts } from '@/hooks/use-alerts';
import type { AlertMode } from '@/hooks/use-notifications';
import { useThemeColors } from '@/hooks/use-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const MODES: { key: AlertMode; label: string }[] = [
  { key: 'chime', label: 'Chime' },
  { key: 'chime_haptic', label: 'Chime + Vibrate' },
  { key: 'haptic', label: 'Vibrate' },
  { key: 'silent', label: 'Silent' },
];

const TestButton = ({ onPress }: { onPress: () => void }) => {
  const C = useThemeColors();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          {
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: C.text,
            backgroundColor: 'transparent',
          },
          animatedStyle,
        ]}
      >
        <Text style={{ 
          color: C.text, 
          fontWeight: '600',
          fontSize: 14,
        }}>
          Test alert
        </Text>
      </Animated.View>
    </Pressable>
  );
};

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

  const PillButton = ({ m }: { m: { key: AlertMode; label: string } }) => {
    const selected = m.key === mode;
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    return (
      <Pressable
        key={m.key}
        onPress={() => setMode(m.key)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            s.pill,
            {
              borderColor: selected ? '#2d5a3d' : C.border,
              backgroundColor: selected ? '#2d5a3d' : 'transparent',
            },
            animatedStyle,
          ]}
        >
          <Text style={{ 
            color: selected ? '#ffffff' : C.text, 
            fontWeight: selected ? '600' : '500',
            fontSize: 14,
          }}>
            {m.label}
          </Text>
        </Animated.View>
      </Pressable>
    );
  };

  const buttons = MODES.map((m) => <PillButton key={m.key} m={m} />);

  return (
    <View style={[s.card, { backgroundColor: C.surface }]}
    >
      <Text style={{ fontWeight: '600', color: C.text, marginBottom: 10, fontSize: 16 }}>Alerts</Text>
      <View style={s.row}>{buttons}</View>
      <Text style={{ color: C.mutedText, marginBottom: 8, fontSize: 14 }}>Choose how the app alerts you throughout your session.</Text>

      <View style={{ alignSelf: 'flex-start', marginTop: 4, marginBottom: 12 }}>
        <TestButton onPress={() => playStartAlert()} />
      </View>

      {/* Play alerts in background toggle */}
      <View style={[s.bgToggleRow, { borderColor: C.border }]}>
        <Text style={{ color: C.text, fontWeight: '600', fontSize: 16 }}>Play alerts in background</Text>
        <Switch value={allowBackgroundAlerts} onValueChange={onToggleAllowBackgroundAlerts} />
      </View>
      <Text style={{ color: C.mutedText, marginTop: 6, marginBottom: 12, fontSize: 14 }}>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
