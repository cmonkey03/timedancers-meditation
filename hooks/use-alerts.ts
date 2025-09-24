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
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAlerts(alertMode: AlertMode) {
  const chime1 = useAudioPlayer(require('@/assets/sounds/chime1.mp3'));
  const chime2 = useAudioPlayer(require('@/assets/sounds/chime2.mp3'));
  const [volume, setVolume] = useState(0.7);

  const delay = useCallback((ms: number) => new Promise((res) => setTimeout(res, ms)), []);

  // Helper to get current alert mode from storage
  const getCurrentAlertMode = useCallback(async (): Promise<AlertMode> => {
    try {
      const saved = await AsyncStorage.getItem('alertMode');
      if (saved === 'chime' || saved === 'chime_haptic' || saved === 'haptic' || saved === 'silent') {
        return saved;
      }
    } catch {}
    return alertMode; // fallback to prop
  }, [alertMode]);

  // Load volume setting on mount
  useEffect(() => {
    getChimeVolume().then(setVolume);
  }, []);

  // Listen for volume changes in storage (check every 2 seconds to reduce overhead)
  useEffect(() => {
    const checkVolumeChanges = setInterval(async () => {
      try {
        const currentVolume = await getChimeVolume();
        if (Math.abs(currentVolume - volume) > 0.01) { // Only update if significantly different
          setVolume(currentVolume);
        }
      } catch {
        // Silently handle storage errors
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(checkVolumeChanges);
  }, [volume]);

  // Update audio player volumes when volume changes or players become available
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
        
        // Stop any current playback
        await p.pause();
        await p.seekTo(0);
        
        // Set volume and play
        p.volume = volume;
        await p.play();
      } catch {
        // Silently handle errors
      }
    },
    [chime1, chime2, volume]
  );

  const playStartAlert = useCallback(async (modeOverride?: AlertMode) => {
    const currentMode = modeOverride || await getCurrentAlertMode();
    if (currentMode === 'chime' || currentMode === 'chime_haptic') {
      await playChime(1);
    }
    if (currentMode === 'haptic' || currentMode === 'chime_haptic') {
      await strongImpact();
    }
  }, [getCurrentAlertMode, playChime, strongImpact]);

  const playCompletionAlert = useCallback(async (modeOverride?: AlertMode) => {
    const currentMode = modeOverride || await getCurrentAlertMode();
    if (currentMode === 'chime' || currentMode === 'chime_haptic') {
      await playChime(2);
    }
    if (currentMode === 'haptic' || currentMode === 'chime_haptic') {
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
  }, [getCurrentAlertMode, playChime, delay]);

  const updateVolume = useCallback(async (newVolume: number) => {
    setVolume(newVolume);
    // Persist to storage
    try {
      await AsyncStorage.setItem('chimeVolume', newVolume.toString());
    } catch {}
    // Volume will be applied to audio players via the useEffect above
  }, []);

  return { playStartAlert, playCompletionAlert, volume, updateVolume };
}
