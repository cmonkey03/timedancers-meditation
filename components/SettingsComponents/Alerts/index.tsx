import { uiText } from '@/data/ui-text';
import { useChime } from '@/hooks/chime-context';
import type { AlertMode } from '@/hooks/use-notifications';
import { useThemeColors } from '@/hooks/use-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const MODES: { key: AlertMode; label: string }[] = [
  { key: 'chime', label: uiText.settings.alerts.modes.chime },
  { key: 'chime_haptic', label: uiText.settings.alerts.modes.chimeHaptic },
  { key: 'haptic', label: uiText.settings.alerts.modes.haptic },
  { key: 'silent', label: uiText.settings.alerts.modes.silent },
];

const TestButton = ({ onPress, disabled }: { onPress: () => void; disabled: boolean }) => {
  const C = useThemeColors();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID="test-alert-button"
      accessibilityLabel={uiText.settings.alerts.accessibility.testAlert}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: disabled ? C.text30 : C.text60,
            backgroundColor: disabled ? C.text30 : 'transparent',
            shadowColor: C.shadow,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ 
          color: disabled ? C.text40 : C.text, 
          fontWeight: '600',
          fontSize: 14,
        }}>
          {uiText.settings.alerts.testAlert}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const VolumeSlider = ({ 
  volume, 
  onVolumeChange, 
  disabled 
}: { 
  volume: number; 
  onVolumeChange: (volume: number) => void;
  disabled: boolean;
}) => {
  const C = useThemeColors();
  const sliderWidth = 200;
  const knobSize = 24;
  
  const translateX = useSharedValue(volume * (sliderWidth - knobSize));
  const isDragging = useSharedValue(false);

  // Update translateX when volume prop changes
  React.useEffect(() => {
    if (!isDragging.value) {
      translateX.value = volume * (sliderWidth - knobSize);
    }
  }, [volume, sliderWidth, knobSize, translateX, isDragging]);

  const [localVolume, setLocalVolume] = useState(volume);

  if (volume !== localVolume && !isDragging.value) {
    setLocalVolume(volume);
  }
  
  const updateVolume = (newVolume: number) => {
    setLocalVolume(newVolume);
  };
  
  const commitVolume = (newVolume: number) => {
    onVolumeChange(newVolume);
  };

  const startPosition = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      startPosition.value = translateX.value;
    })
    .onUpdate((event) => {
      if (disabled) return;
      
      const newTranslateX = Math.max(0, Math.min(sliderWidth - knobSize, startPosition.value + event.translationX));
      translateX.value = newTranslateX;
      
      const newVolume = newTranslateX / (sliderWidth - knobSize);
      runOnJS(updateVolume)(newVolume);
    })
    .onEnd(() => {
      isDragging.value = false;
      const finalVolume = translateX.value / (sliderWidth - knobSize);
      runOnJS(commitVolume)(finalVolume);
    });

  const tapGesture = Gesture.Tap()
    .onStart((event) => {
      if (disabled) return;
      
      const newTranslateX = Math.max(0, Math.min(sliderWidth - knobSize, event.x - knobSize / 2));
      translateX.value = withSpring(newTranslateX);
      
      const newVolume = newTranslateX / (sliderWidth - knobSize);
      runOnJS(commitVolume)(newVolume);
    });

  const knobAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const activeTrackAnimatedStyle = useAnimatedStyle(() => ({
    width: translateX.value + knobSize / 2,
  }));

  const volumePercentage = Math.round(localVolume * 100);

  return (
    <View style={styles.volumeContainer}>
      <View style={styles.volumeHeader}>
        <Text style={{ color: C.text, fontWeight: '600', fontSize: 16 }}>
          {uiText.settings.alerts.chimeVolume}
        </Text>
        <Text style={{ color: C.text, opacity: 0.75, fontSize: 14 }}>
          {volumePercentage}%
        </Text>
      </View>
      
      <View style={styles.sliderContainer}>
        <GestureDetector gesture={Gesture.Simultaneous(panGesture, tapGesture)}>
          <Animated.View
            style={[
              styles.sliderTrack,
              { 
                backgroundColor: disabled ? `${C.text}20` : `${C.text}30`,
                width: sliderWidth,
              }
            ]}
            accessibilityLabel={`${uiText.settings.alerts.accessibility.chimeVolume} ${volumePercentage}%`}
            accessibilityRole="adjustable"
            accessibilityValue={{ min: 0, max: 100, now: volumePercentage }}
            accessibilityHint={uiText.settings.alerts.accessibility.adjustVolume}
            accessible={true}
          >
            {/* Active track */}
            <Animated.View
              style={[
                styles.sliderActiveTrack,
                {
                  backgroundColor: disabled ? C.text40 : C.buttonPrimary,
                },
                activeTrackAnimatedStyle,
              ]}
            />
            
            {/* Knob */}
            <Animated.View
              style={[
                styles.sliderKnob,
                {
                  backgroundColor: disabled ? C.text60 : C.buttonPrimary,
                  borderColor: C.surface,
                },
                knobAnimatedStyle,
              ]}
            />
          </Animated.View>
        </GestureDetector>
        
        <View style={styles.volumeLabels}>
          <Text style={{ color: C.text, opacity: 0.5, fontSize: 12 }}>0%</Text>
          <Text style={{ color: C.text, opacity: 0.5, fontSize: 12 }}>100%</Text>
        </View>
      </View>
    </View>
  );
};

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
        const endAt = await AsyncStorage.getItem('activeSessionEndAtMs');
        setSessionActive(!!endAt && Date.now() < parseInt(endAt));
      } catch {}
    };
    check();
    const id = setInterval(check, 2000);
    return () => clearInterval(id);
  }, []);

  const handleVolumeChange = async (newVolume: number) => {
    await updateVolume(newVolume);
  };

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
        testID={`alert-mode-${m.key}`}
        accessibilityLabel={m.label}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
      >
        <Animated.View
          style={[
            styles.pill,
            {
              borderColor: selected ? C.buttonPrimary : C.text30,
              backgroundColor: selected ? C.buttonPrimary : C.buttonGhost,
              shadowColor: C.shadow,
            },
            animatedStyle,
          ]}
        >
          <Text style={{ 
            color: selected ? C.buttonPrimaryText : C.text, 
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
    <View style={[styles.card, { backgroundColor: C.surface }]}
    >
      <Text style={{ fontWeight: '600', color: C.text, marginBottom: 10, fontSize: 16 }}>Alerts</Text>
      <View style={styles.row}>{buttons}</View>
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
        <TestButton onPress={() => playStartAlert()} disabled={sessionActive} />
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  volumeContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  volumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderContainer: {
    alignItems: 'center',
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderActiveTrack: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
  },
  sliderKnob: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  volumeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 8,
  },
});
