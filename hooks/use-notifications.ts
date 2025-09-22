/**
 * Notifications hook for meditation sessions.
 *
 * Responsibilities:
 * - Initialize local notifications (permissions + Android channels)
 * - Compute and schedule absolute-time notifications for remaining phase boundaries
 * - Handle background/foreground transitions to schedule/cancel appropriately
 * - Manage a session end token so we can clean up stale notifications on cold start
 */
import type { UsePhasedTimerState } from '@/hooks/use-phased-timer';
import { computeScheduleItems } from '@/utils/notification-schedule';
import * as Notifier from '@/utils/notifications';
import * as Timer from '@/utils/timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export type AlertMode = 'chime' | 'chime_haptic' | 'haptic' | 'silent';

/**
 * Compute notification schedule items from the current timer state.
 * Pure helper to enable unit testing without invoking React or the OS scheduler.
 */

export function useNotifications(
  timer: UsePhasedTimerState,
  alertMode: AlertMode,
  allowBackgroundAlerts: boolean
) {
  // Init notifications once
  useEffect(() => {
    Notifier.initNotifications().catch(() => {});
  }, []);

  const scheduleNotificationsForRemaining = useCallback(async () => {
    if (!allowBackgroundAlerts) return;
    const items = computeScheduleItems(timer, alertMode);
    if (items.length === 0) return;

    await Notifier.cancelAllScheduled();
    for (const it of items) {
      if (__DEV__) {
        console.log('[notify] scheduleAt', {
          whenEpochMs: it.whenEpochMs,
          inMs: it.whenEpochMs - Date.now(),
          title: it.title,
          body: it.body,
          withSound: it.withSound,
        });
      }
      await Notifier.scheduleAtMs(it.whenEpochMs, it.title, it.body, { withSound: it.withSound });
    }
    // Persist expected end time based on the last scheduled item (completion)
    const last = items[items.length - 1];
    if (last?.whenEpochMs) {
      await AsyncStorage.setItem('activeSessionEndAtMs', String(last.whenEpochMs)).catch(() => {});
    }
  }, [allowBackgroundAlerts, timer, alertMode]);

  // AppState-based scheduling/cancellation
  useEffect(() => {
    const onChange = (s: AppStateStatus) => {
      if (s === 'active') {
        Notifier.cancelAllScheduled();
      } else if (timer.running && allowBackgroundAlerts) {
        scheduleNotificationsForRemaining();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [scheduleNotificationsForRemaining, timer.running, allowBackgroundAlerts]);

  const markSessionStart = useCallback(async () => {
    // Persist expected end time for cold-start cleanup
    const totalMs = Timer.totalDurationMs(timer.phases);
    await AsyncStorage.setItem('activeSessionEndAtMs', String(Date.now() + totalMs)).catch(() => {});
  }, [timer.phases]);

  const clearSessionToken = useCallback(async () => {
    await AsyncStorage.removeItem('activeSessionEndAtMs').catch(() => {});
  }, []);

  const coldStartCleanup = useCallback(async () => {
    const endAt = await AsyncStorage.getItem('activeSessionEndAtMs');
    const endAtMs = endAt ? parseInt(endAt) : 0;
    if (!timer.started && (!endAtMs || Date.now() > endAtMs)) {
      Notifier.cancelAllScheduled();
      await AsyncStorage.removeItem('activeSessionEndAtMs');
    }
  }, [timer.started]);

  return {
    scheduleNotificationsForRemaining,
    markSessionStart,
    clearSessionToken,
    coldStartCleanup,
  };
}
