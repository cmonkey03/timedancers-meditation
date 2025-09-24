/**
 * Alerts hook for meditation sessions.
 *
 * Responsibilities:
 * - Play chime assets using expo-audio
 * - Trigger appropriate haptic feedback via expo-haptics
 * - Provide simple APIs to fire alerts for start and completion
 */
import { useCallback, useEffect, useState } from 'react';
import { Platform, Vibration } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { AlertMode } from '@/hooks/use-notifications';
import { getChimeVolume } from '@/utils/settings';

export function useAlerts(alertMode: AlertMode) {
  const chime1 = useAudioPlayer(require('@/assets/sounds/chime1.mp3'));
  const chime2 = useAudioPlayer(require('@/assets/sounds/chime2.mp3'));
  const [volume, setVolume] = useState(0.7);

  const delay = useCallback((ms: number) => new Promise((res) => setTimeout(res, ms)), []);

  // Load volume setting on mount
  useEffect(() => {
    getChimeVolume().then(setVolume);
  }, []);

  // Update audio player volumes when volume changes
  useEffect(() => {
    if (chime1) {
      chime1.volume = volume;
    }
    if (chime2) {
      chime2.volume = volume;
    }
  }, [volume, chime1, chime2]);

  const strongImpact = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        // Very strong multi-pulse pattern for Android (~1300ms)
        // Pattern: 200,100,300,100,200,100,300
        Vibration.vibrate([0, 200, 100, 300, 100, 200, 100, 300], false);
      } else {
        // iOS: chain multiple strong notifications and heavy impacts
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        await delay(100);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await delay(100);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await delay(120);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch {}
  }, [delay]);

  const playChime = useCallback(
    async (which: 1 | 2) => {
      try {
        const p = which === 1 ? chime1 : chime2;
        if (!p) return;
        await p.seekTo(0);
        await p.play();
      } catch {}
    },
    [chime1, chime2]
  );

  const playStartAlert = useCallback(async () => {
    if (alertMode === 'chime' || alertMode === 'chime_haptic') {
      await playChime(1);
    }
    if (alertMode === 'haptic' || alertMode === 'chime_haptic') {
      await strongImpact();
    }
  }, [alertMode, playChime, strongImpact]);

  const playCompletionAlert = useCallback(async () => {
    if (alertMode === 'chime' || alertMode === 'chime_haptic') {
      await playChime(2);
    }
    if (alertMode === 'haptic' || alertMode === 'chime_haptic') {
      try {
        if (Platform.OS === 'android') {
          // Strongest completion pattern (~1800ms)
          // Pattern: 300,120,400,120,300,120,400
          Vibration.vibrate([0, 300, 120, 400, 120, 300, 120, 400], false);
        } else {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          await delay(120);
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          await delay(120);
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          await delay(140);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } catch {}
    }
  }, [alertMode, playChime, delay]);

  const updateVolume = useCallback(async (newVolume: number) => {
    setVolume(newVolume);
    // Volume will be applied to audio players via the useEffect above
  }, []);

  return { playStartAlert, playCompletionAlert, volume, updateVolume };
}
