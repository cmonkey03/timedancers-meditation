import Cloud from '@/components/Session/Wheel/Cloud';
import Dial from '@/components/Session/Wheel/Dial';
import { useI18n } from '@/contexts/I18nContext';
import { useCustomFonts } from '@/hooks/ui/use-fonts';
import { useThemeColors } from '@/hooks/ui/use-theme';
import type { TimerNow } from '@/types';
import { clampMinutes, fingerAngleToMinutes } from '@/utils/dial';
import displayTime from '@/utils/display-time';
import { overallProgress } from '@/utils/ring';
import * as Timer from '@/utils/timer';
import { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Svg from 'react-native-svg';

// The circular slider's track radius relative to half the canvas size
const DIAL_RADIUS_FRACTION = 0.5;
// Center cloud radius relative to half the canvas size (idle -> full bloom)
const CLOUD_BASE_FRACTION = 0.44;
const CLOUD_MAX_FRACTION = 0.92;

type WheelTimer = {
  now: TimerNow;
  phases: { seconds: number }[];
  started: boolean;
};

interface WheelProps {
  timer: WheelTimer;
  minutes: number;
  onDialMinutes: (minutes: number) => void;
}

export default function Wheel({ timer, minutes, onDialMinutes }: WheelProps) {
  const C = useThemeColors();
  const { t } = useI18n();
  const { fontsLoaded, fonts } = useCustomFonts();

  const { width } = useWindowDimensions();
  const size = Math.min(width - 48, 360);
  const half = size / 2;

  // Overall session progress drives the center cloud's expansion
  const cloudP = useSharedValue(0);

  // Rotation for the cloud core
  const cloudRotation = useSharedValue(0);

  const lastCommitted = useSharedValue(minutes);

  // Keep the committed value in sync with the persisted minutes prop
  useEffect(() => {
    lastCommitted.value = minutes;
  }, [minutes, lastCommitted]);

  // Drive the cloud expansion from timer state
  useEffect(() => {
    const phaseSeconds = timer.phases.map((p) => p.seconds);
    if (timer.now.done) {
      // Reset to idle size when done
      cloudP.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
    } else {
      cloudP.value = withTiming(overallProgress(timer.now, phaseSeconds), {
        duration: 1000, // Match timer update interval for smooth expansion
        easing: Easing.linear,
      });
    }
  }, [timer.now, timer.phases, cloudP]);

  // Smooth continuous rotation using setInterval
  useEffect(() => {
    if (timer.started && !timer.now.done) {
      const interval = setInterval(() => {
        cloudRotation.value = (cloudRotation.value + 0.15) % 360;
      }, 8); // 120fps for smoother rotation
      return () => clearInterval(interval);
    } else {
      cloudRotation.value = withTiming(0, { duration: 500 });
    }
  }, [timer.started, timer.now.done, cloudRotation]);

  const commitMinutes = useCallback(
    (m: number) => {
      onDialMinutes(m);
    },
    [onDialMinutes]
  );

  // Circular slider (idle only): the value tracks the finger's angle around the
  // cloud. Tap a spot on the ring to jump to that duration, or brush around to
  // adjust it. 12 o'clock = 60, one full circle = 60 minutes.
  const dialGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(!timer.started)
      .minDistance(0)
      .shouldCancelWhenOutside(false)
      .onStart((e) => {
        'worklet';
        const clamped = fingerAngleToMinutes(Math.atan2(e.y - half, e.x - half));
        if (clamped !== lastCommitted.value) {
          lastCommitted.value = clamped;
          runOnJS(commitMinutes)(clamped);
        }
      })
      .onUpdate((e) => {
        'worklet';
        const clamped = fingerAngleToMinutes(Math.atan2(e.y - half, e.x - half));
        if (clamped !== lastCommitted.value) {
          lastCommitted.value = clamped;
          runOnJS(commitMinutes)(clamped);
        }
      });
  }, [timer.started, half, lastCommitted, commitMinutes]);

  const onAccessibilityAction = useCallback(
    (event: { nativeEvent: { actionName: string } }) => {
      const next = event.nativeEvent.actionName === 'increment' ? minutes + 1 : minutes - 1;
      onDialMinutes(clampMinutes(next));
    },
    [minutes, onDialMinutes]
  );

  const totalSeconds = timer.now.done
    ? 0
    : timer.started
      ? Timer.getRemainingSeconds(timer.now.totalRemainingMs)
      : minutes * 60;
  const timeText = displayTime(totalSeconds);

  const dialRadius = DIAL_RADIUS_FRACTION * half;

  // Cloud radius based on progress
  const cloudRadius = (CLOUD_BASE_FRACTION + (CLOUD_MAX_FRACTION - CLOUD_BASE_FRACTION) * cloudP.value) * half;

  return (
    <View style={[styles.canvas, { width: size, height: size }]} testID="timewheel-canvas">
      <GestureDetector gesture={dialGesture}>
        <View
          style={StyleSheet.absoluteFill}
          accessibilityRole={timer.started ? 'none' : 'adjustable'}
          accessibilityLabel={
            timer.started
              ? t('session.accessibility.sessionInProgress')
              : t('session.accessibility.selectSessionTime')
          }
          accessibilityValue={timer.started ? undefined : { text: `${minutes} minutes` }}
          accessibilityActions={
            timer.started
              ? undefined
              : [
                  { name: 'increment', label: 'Increase session time' },
                  { name: 'decrement', label: 'Decrease session time' },
                ]
          }
          onAccessibilityAction={timer.started ? undefined : onAccessibilityAction}
        >
          <View style={StyleSheet.absoluteFill}>
            <Svg width={size} height={size}>
              {/* The rotating cloud */}
              <Cloud
                size={size}
                radius={cloudRadius}
                rotation={cloudRotation.value}
                progress={cloudP.value}
              />
              {/* Circular slider dial with minute labels (idle only) */}
              {!timer.started && <Dial size={size} r={dialRadius} minutes={minutes} />}
            </Svg>
          </View>
        </View>
      </GestureDetector>

      {/* Central digital timer */}
      <View style={styles.centerWrap} pointerEvents="none">
        <Text
          style={[
            styles.time,
            { color: C.wheelText, fontSize: size * 0.11 },
            fontsLoaded && { fontFamily: fonts.inter.semiBold },
          ]}
          accessibilityLabel={timeText}
        >
          {timeText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
});
