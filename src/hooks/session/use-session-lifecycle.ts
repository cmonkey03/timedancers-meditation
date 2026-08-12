/**
 * Session lifecycle hook for unified session state and side effect management.
 *
 * Responsibilities:
 * - Coordinate session lifecycle events (start, pause, resume, cancel, complete)
 * - Manage background notification scheduling
 * - Handle session state persistence and cleanup
 * - Coordinate app state transitions for background notifications
 * - Provide unified interface for session control
 */
import { settingsService } from '@/services/settings';
import type { AlertMode, UsePhasedTimerState } from '@/types';
import { computeScheduleItems } from '@/utils/notification-schedule';
import * as Notifier from '@/utils/notifications';
import * as Timer from '@/utils/timer';
import { useCallback, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useSessionLifecycle(
  timer: UsePhasedTimerState,
  alertMode: AlertMode,
  allowBackgroundAlerts: boolean
) {
  // ==================== Notification Scheduling ====================
  
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
      await settingsService.setActiveSessionEndAtMs(last.whenEpochMs);
    }
  }, [allowBackgroundAlerts, timer, alertMode]);

  // ==================== Session State Management ====================

  const markSessionStart = useCallback(async () => {
    // Persist expected end time for cold-start cleanup
    const totalMs = Timer.totalDurationMs(timer.phases);
    await settingsService.setActiveSessionEndAtMs(Date.now() + totalMs);
  }, [timer.phases]);

  const clearSessionToken = useCallback(async () => {
    await settingsService.clearActiveSessionEndAtMs();
  }, []);

  // ==================== AppState Management ====================

  useEffect(() => {
    const onChange = (s: AppStateStatus) => {
      if (s === 'active') {
        // Cancel background notifications when app becomes active
        Notifier.cancelAllScheduled();
      } else if (timer.running && allowBackgroundAlerts) {
        // Schedule notifications when app goes background during active session
        scheduleNotificationsForRemaining();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [scheduleNotificationsForRemaining, timer.running, allowBackgroundAlerts]);

  // ==================== Cold Start Cleanup ====================

  const coldStartCleanup = useCallback(async () => {
    const endAtMs = await settingsService.getActiveSessionEndAtMs();
    if (!timer.started && (!endAtMs || Date.now() > endAtMs)) {
      Notifier.cancelAllScheduled();
      await settingsService.clearActiveSessionEndAtMs();
    }
  }, [timer.started]);

  // ==================== Settings Change Reactions ====================

  useEffect(() => {
    if (!timer.running) return;
    if (allowBackgroundAlerts) {
      scheduleNotificationsForRemaining();
    } else {
      Notifier.cancelAllScheduled();
    }
  }, [alertMode, allowBackgroundAlerts, timer.running, scheduleNotificationsForRemaining]);

  return {
    scheduleNotificationsForRemaining,
    markSessionStart,
    clearSessionToken,
    coldStartCleanup,
  };
}