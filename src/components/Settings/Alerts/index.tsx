import { useChime } from '@/hooks/chime-context';
import { useThemeColors } from '@/hooks/ui/use-theme';
import { settingsService } from '@/services/settings';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import ModeSelector from './ModeSelector';
import TestAlertButton from './TestAlertButton';
import VolumeSlider from './VolumeSlider';

type Props = {
  allowBackgroundAlerts: boolean;
  onToggleAllowBackgroundAlerts: (v: boolean) => void;
};

export default function AlertsSettings({ allowBackgroundAlerts, onToggleAllowBackgroundAlerts }: Props) {
  const C = useThemeColors();
  const { playStartAlert, volume, updateVolume, mode, setMode } = useChime();
  const [sessionActive, setSessionActive] = useState(false);

  // Check if a session session is active
  useEffect(() => {
    const check = async () => {
      try {
        const endAtMs = await settingsService.getActiveSessionEndAtMs();
        setSessionActive(!!endAtMs && Date.now() < endAtMs);
      } catch {}
    };
    check();
    const id = setInterval(check, 2000);
    return () => clearInterval(id);
  }, []);

  const handleVolumeChange = async (newVolume: number) => {
    await updateVolume(newVolume);
  };

  return (
    <View style={[styles.card, { backgroundColor: C.surface }]}>
      <Text style={{ fontWeight: '600', color: C.text, marginBottom: 10, fontSize: 16 }}>Alerts</Text>
      <ModeSelector mode={mode} onModeChange={setMode} />
      <Text style={{ color: C.text, opacity: 0.75, marginBottom: 8, fontSize: 14 }}>Choose how the app alerts you throughout your session.</Text>

      {/* Volume slider - only show for chime modes */}
      {(mode === 'chime' || mode === 'chime_haptic') && (
        <VolumeSlider
          volume={volume}
          onVolumeChange={handleVolumeChange}
          disabled={false}
        />
      )}

      <View style={{ alignSelf: 'flex-start', marginTop: 4, marginBottom: 12 }}>
        <TestAlertButton onPress={() => playStartAlert()} disabled={sessionActive} />
      </View>

      {/* Play alerts in background toggle */}
      <View style={[styles.bgToggleRow, { borderColor: C.border }]}>
        <Text style={{ color: C.text, fontWeight: '600', fontSize: 16 }}>Play alerts in background</Text>
        <Switch 
          value={allowBackgroundAlerts} 
          onValueChange={onToggleAllowBackgroundAlerts}
          testID="background-alerts-switch"
        />
      </View>
      <Text style={{ color: C.text, opacity: 0.75, marginTop: 6, marginBottom: 12, fontSize: 14 }}>
        Chimes & haptics still play if the app is in the background or the screen is locked.
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
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
});