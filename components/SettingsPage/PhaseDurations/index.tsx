import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { setPhaseSeconds } from '@/utils/settings';

export default function PhaseDurations() {
  const C = useThemeColors();
  const [minutes, setMinutes] = useState<string>('3');
  const [powerMin, setPowerMin] = useState<string>('');
  const [heartMin, setHeartMin] = useState<string>('');
  const [wisdomMin, setWisdomMin] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const m = await AsyncStorage.getItem('lastDurationMinutes');
        if (m) setMinutes(m);
        const ps = await AsyncStorage.getItem('phaseSeconds.power');
        const hs = await AsyncStorage.getItem('phaseSeconds.heart');
        const ws = await AsyncStorage.getItem('phaseSeconds.wisdom');
        if (ps) setPowerMin(String(Math.max(1, Math.round(parseInt(ps, 10) / 60))));
        if (hs) setHeartMin(String(Math.max(1, Math.round(parseInt(hs, 10) / 60))));
        if (ws) setWisdomMin(String(Math.max(1, Math.round(parseInt(ws, 10) / 60))));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('lastDurationMinutes', minutes).catch(() => {});
  }, [minutes]);

  useEffect(() => {
    const n = parseInt(powerMin, 10);
    if (!isNaN(n) && n > 0) setPhaseSeconds({ power: n * 60 }).catch(() => {});
    if (powerMin.trim() === '') setPhaseSeconds({ power: undefined }).catch(() => {});
  }, [powerMin]);
  useEffect(() => {
    const n = parseInt(heartMin, 10);
    if (!isNaN(n) && n > 0) setPhaseSeconds({ heart: n * 60 }).catch(() => {});
    if (heartMin.trim() === '') setPhaseSeconds({ heart: undefined }).catch(() => {});
  }, [heartMin]);
  useEffect(() => {
    const n = parseInt(wisdomMin, 10);
    if (!isNaN(n) && n > 0) setPhaseSeconds({ wisdom: n * 60 }).catch(() => {});
    if (wisdomMin.trim() === '') setPhaseSeconds({ wisdom: undefined }).catch(() => {});
  }, [wisdomMin]);

  return (
    <View>
      <Text style={{ fontWeight: '600', color: C.text }}>Default Duration (minutes)</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="Minutes"
        value={minutes}
        onChangeText={setMinutes}
        placeholderTextColor={C.mutedText}
        style={{ borderColor: C.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: C.text, marginTop: 6, marginBottom: 16 }}
        blurOnSubmit
      />

      <Text style={{ fontWeight: '600', color: C.text, marginTop: 8 }}>Per-phase Durations (optional, minutes)</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.mutedText, marginBottom: 4 }}>Power</Text>
          <TextInput keyboardType="numeric" placeholder="e.g. 5" value={powerMin} onChangeText={setPowerMin} placeholderTextColor={C.mutedText} style={{ borderColor: C.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: C.text }} blurOnSubmit />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.mutedText, marginBottom: 4 }}>Heart</Text>
          <TextInput keyboardType="numeric" placeholder="e.g. 5" value={heartMin} onChangeText={setHeartMin} placeholderTextColor={C.mutedText} style={{ borderColor: C.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: C.text }} blurOnSubmit />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.mutedText, marginBottom: 4 }}>Wisdom</Text>
          <TextInput keyboardType="numeric" placeholder="e.g. 5" value={wisdomMin} onChangeText={setWisdomMin} placeholderTextColor={C.mutedText} style={{ borderColor: C.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, color: C.text }} blurOnSubmit />
        </View>
      </View>
    </View>
  );
}
