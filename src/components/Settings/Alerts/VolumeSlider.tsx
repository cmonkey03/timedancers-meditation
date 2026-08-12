import { useI18n } from '@/contexts/I18nContext';
import { useThemeColors } from '@/hooks/ui/use-theme';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface VolumeSliderProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  disabled: boolean;
}

export default function VolumeSlider({ volume, onVolumeChange, disabled }: VolumeSliderProps) {
  const C = useThemeColors();
  const { t } = useI18n();
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
          {t('settings.alerts.chimeVolume')}
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
            accessibilityLabel={`${t('settings.alerts.accessibility.chimeVolume')} ${volumePercentage}%`}
            accessibilityRole="adjustable"
            accessibilityValue={{ min: 0, max: 100, now: volumePercentage }}
            accessibilityHint={t('settings.alerts.accessibility.adjustVolume')}
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
}

const styles = StyleSheet.create({
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