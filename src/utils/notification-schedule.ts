// Pure scheduling logic for notifications without importing React Native.
// This file is safe to import from unit tests.

import { defaultLocale, getLocaleStrings, Locale } from '@/locales';
import type { AlertMode, UsePhasedTimerState } from '@/types';

export function computeScheduleItems(
  timer: UsePhasedTimerState,
  alertMode: AlertMode,
  locale: Locale = defaultLocale
): { whenEpochMs: number; title: string; body: string; withSound: boolean }[] {
  if (!timer.started || timer.startAtMs == null) return [];

  const strings = getLocaleStrings(locale);

  // Compute total session duration in ms (sum of configured phases)
  const totalMs = timer.phases.reduce((sum, p) => sum + (p.seconds || 0) * 1000, 0);
  if (totalMs <= 0) return [];

  const nowMs = Date.now();
  const elapsedMs = Math.max(0, nowMs - (timer.startAtMs ?? 0) - timer.pausedTotalMs);
  const remainingMs = Math.max(0, totalMs - elapsedMs);
  if (remainingMs <= 0) return [];
  const withSound = alertMode === 'chime' || alertMode === 'chime_haptic';
  const endEpochMs = nowMs + remainingMs;

  // Only schedule the completion notification
  return [
    {
      whenEpochMs: endEpochMs,
      title: strings.notifications.sessionComplete,
      body: strings.notifications.sessionFinished,
      withSound,
    },
  ];
}

