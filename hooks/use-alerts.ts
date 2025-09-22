/**
 * Alerts hook for meditation sessions.
 *
 * Responsibilities:
 * - Play chime assets using expo-audio
 * - Trigger appropriate haptic feedback via expo-haptics
 * - Provide simple APIs to fire alerts for start and completion
 */
import { useCallback } from 'react';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { AlertMode } from '@/hooks/use-notifications';

export function useAlerts(alertMode: AlertMode) {
  const chime1 = useAudioPlayer(require('@/assets/sounds/chime1.mp3'));
  const chime2 = useAudioPlayer(require('@/assets/sounds/chime2.mp3'));

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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  }, [alertMode, playChime]);

  const playCompletionAlert = useCallback(async () => {
    if (alertMode === 'chime' || alertMode === 'chime_haptic') {
      await playChime(2);
    }
    if (alertMode === 'haptic' || alertMode === 'chime_haptic') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [alertMode, playChime]);

  return { playStartAlert, playCompletionAlert };
}
