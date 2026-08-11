/**
 * Session completion hook for handling session completion and auto-reset.
 *
 * Responsibilities:
 * - Trigger completion chime
 * - Show completion message
 * - Auto-reset after delay
 * - Manage completion state refs
 */
import * as Notifier from '@/utils/notifications';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useSessionCompletion(
  timer: {
    now: {
      done: boolean;
    };
    started: boolean;
  },
  triggerChime: (event: any) => Promise<void>,
  clearSessionToken: () => Promise<void>,
  reset: () => void,
  resetChimeState: () => void
) {
  const [showCompleted, setShowCompleted] = useState(false);
  const completionResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionTriggeredRef = useRef(false);

  // React to timer state updates to trigger completion chime
  useEffect(() => {
    if (timer.now.done && !showCompleted && !completionTriggeredRef.current) {
      completionTriggeredRef.current = true;
      triggerChime('sessionComplete');
      Notifier.cancelAllScheduled();
      clearSessionToken();
      if (completionResetTimeoutRef.current) clearTimeout(completionResetTimeoutRef.current);
      setShowCompleted(true);
      // Auto-reset after 10 seconds
      completionResetTimeoutRef.current = setTimeout(() => {
        reset();
        setShowCompleted(false);
        resetChimeState();
        // Don't reset completionTriggeredRef here - it will be reset when timer actually resets
      }, 10000);
    }
  }, [timer.now.done, triggerChime, clearSessionToken, reset, resetChimeState, showCompleted]);

  // Cleanup any pending completion reset timeout on unmount
  useEffect(() => {
    const timeout = completionResetTimeoutRef.current;
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  // Reset completion state when timer resets
  useEffect(() => {
    if (!timer.started) {
      setShowCompleted(false);
      // Don't reset completionTriggeredRef here - it's managed by the completion timeout
    }
  }, [timer.started]);

  const resetCompletionTriggered = useCallback(() => {
    completionTriggeredRef.current = false;
  }, []);

  return {
    showCompleted,
    resetCompletionTriggered,
  };
}
