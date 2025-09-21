// Pure scheduling logic for notifications without importing React Native.
// This file is safe to import from unit tests.

import type { UsePhasedTimerState } from '@/hooks/use-phased-timer';

export type AlertMode = 'chime' | 'chime_haptic' | 'haptic' | 'silent';

export function computeScheduleItems(
  timer: UsePhasedTimerState,
  alertMode: AlertMode
): { whenEpochMs: number; title: string; body: string; withSound: boolean }[] {
  if (!timer.started || timer.startAtMs == null) return [];

  const nowMs = Date.now();
  const elapsedMs = Math.max(0, nowMs - (timer.startAtMs ?? 0) - timer.pausedTotalMs);

  // cumulative phase boundaries in ms
  const cumMs: number[] = [];
  let acc = 0;
  for (const p of timer.phases) {
    acc += (p.seconds || 0) * 1000;
    cumMs.push(acc);
  }

  const withSound = alertMode === 'chime' || alertMode === 'chime_haptic';
  // Epoch base: use startAtMs only; paused time is accounted for in elapsed filtering
  const baseEpoch = timer.startAtMs ?? 0;
  const items: { whenEpochMs: number; title: string; body: string; withSound: boolean }[] = [];

  for (let i = 0; i < cumMs.length; i++) {
    const boundary = cumMs[i];
    if (boundary <= elapsedMs) continue;
    const whenEpochMs = baseEpoch + boundary;
    const isCompletion = i === cumMs.length - 1;
    if (isCompletion) {
      items.push({ whenEpochMs, title: 'Meditation complete', body: 'Session finished', withSound });
    } else {
      const nextKey = timer.phases[i + 1]?.key ?? 'next phase';
      items.push({ whenEpochMs, title: 'Phase change', body: `Begin ${capitalize(nextKey)}`, withSound });
    }
  }

  return items;
}

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
