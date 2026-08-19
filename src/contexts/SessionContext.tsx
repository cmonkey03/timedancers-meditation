/**
 * SessionContext - Centralized session state management
 * Consolidates timer, audio, notifications, and persistence logic
 */
import { useChime } from '@/hooks/chime-context';
import { useKeepAwakeSafe } from '@/hooks/platform/use-keep-awake-safe';
import { useNotifications } from '@/hooks/platform/use-notifications';
import { useSessionAppState } from '@/hooks/platform/use-session-app-state';
import { usePhasedTimer } from '@/hooks/session/use-phased-timer';
import { useSessionAudio } from '@/hooks/session/use-session-audio';
import { useSessionCompletion } from '@/hooks/session/use-session-completion';
import { useSessionEffects } from '@/hooks/session/use-session-effects';
import { useSessionPersistence } from '@/hooks/session/use-session-persistence';
import type { ChimeEvent, UsePhasedTimerState } from '@/types';
import * as Notifier from '@/utils/notifications';
import * as Timer from '@/utils/timer';
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';

export interface SessionContextValue {
  // Timer state
  timer: UsePhasedTimerState;
  
  // Timer controls
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  cancelSession: () => void;
  
  // Session state
  input: string;
  setInput: (value: string) => void;
  handleInput: (text: string) => void;
  allowBackgroundAlerts: boolean;
  setAllowBackgroundAlerts: (value: boolean) => void;
  
  // UI state
  showCompleted: boolean;
  prevIndex: React.MutableRefObject<number>;
  
  // Audio/Alerts
  triggerChime: (event: ChimeEvent) => Promise<void>;
  playStartAlert: () => Promise<void>;
  alertMode: string;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Initialize hooks
  useKeepAwakeSafe();
  useSessionAudio();
  const appIsActiveRef = useSessionAppState();
  
  const { playStartAlert, triggerChime, resetChimeState, mode: alertMode } = useChime();
  
  // Timer state
  const initialPhases = useMemo(() => Timer.createPhasesFromMinutes(10), []);
  const { state: timer, start, pause, resume, reset, setPhases } = usePhasedTimer(initialPhases);
  
  // Persistence
  const { input, setInput, allowBackgroundAlerts, setAllowBackgroundAlerts, handleInput } = useSessionPersistence(timer.started);
  
  // Notifications
  const { scheduleNotificationsForRemaining, markSessionStart, clearSessionToken, coldStartCleanup } = useNotifications(
    timer,
    alertMode,
    allowBackgroundAlerts
  );
  
  // Handle cold start cleanup on mount
  useEffect(() => {
    coldStartCleanup();
  }, [coldStartCleanup]);
  
  // Update phases when input changes (only when idle)
  useEffect(() => {
    if (timer.running || timer.started) return;
    const minutes = parseInt(input) || 10;
    const next = Timer.createPhasesFromMinutes(minutes);
    const curr = timer.phases;
    const differs =
      curr[0]?.seconds !== next[0].seconds ||
      curr[1]?.seconds !== next[1].seconds ||
      curr[2]?.seconds !== next[2].seconds;
    if (differs) setPhases(next);
  }, [input, timer.running, timer.started, timer.phases, setPhases]);
  
  // Reschedule notifications when settings change
  useEffect(() => {
    if (!timer.running) return;
    if (allowBackgroundAlerts) {
      scheduleNotificationsForRemaining();
    } else {
      Notifier.cancelAllScheduled();
    }
  }, [alertMode, allowBackgroundAlerts, timer.running, scheduleNotificationsForRemaining]);
  
  // Session effects (phase transitions, haptics)
  const prevIndex = useSessionEffects(timer, triggerChime);
  
  // Session completion handling
  const { showCompleted, resetCompletionTriggered } = useSessionCompletion(
    timer,
    triggerChime,
    clearSessionToken,
    reset,
    resetChimeState
  );
  
  // Session controls
  const startSession = useCallback(async () => {
    if (!timer.running && !timer.started) {
      start();
      resetCompletionTriggered();
      if (allowBackgroundAlerts) scheduleNotificationsForRemaining();
      markSessionStart();
      
      // Initial phase alert with delay
      const fireStartAlert = () => {
        if (!appIsActiveRef.current) return;
        setTimeout(() => {
          triggerChime('sessionStart');
        }, 300);
      };
      setTimeout(fireStartAlert, 120);
    }
  }, [timer.running, timer.started, start, resetCompletionTriggered, allowBackgroundAlerts, scheduleNotificationsForRemaining, markSessionStart, appIsActiveRef, triggerChime]);
  
  const pauseSession = useCallback(() => {
    pause();
    Notifier.cancelAllScheduled();
  }, [pause]);
  
  const resumeSession = useCallback(() => {
    resume();
    if (allowBackgroundAlerts) scheduleNotificationsForRemaining();
  }, [resume, allowBackgroundAlerts, scheduleNotificationsForRemaining]);
  
  const cancelSession = useCallback(() => {
    const minutes = parseInt(input) || 10;
    const newPhases = Timer.createPhasesFromMinutes(minutes);
    setPhases(newPhases);
    reset();
    Notifier.cancelAllScheduled();
    clearSessionToken();
    resetChimeState();
    resetCompletionTriggered();
  }, [input, setPhases, reset, clearSessionToken, resetChimeState, resetCompletionTriggered]);
  
  const value: SessionContextValue = useMemo(() => ({
    timer,
    startSession,
    pauseSession,
    resumeSession,
    cancelSession,
    input,
    setInput,
    handleInput,
    allowBackgroundAlerts,
    setAllowBackgroundAlerts,
    showCompleted,
    prevIndex,
    triggerChime,
    playStartAlert,
    alertMode,
  }), [
    timer,
    startSession,
    pauseSession,
    resumeSession,
    cancelSession,
    input,
    setInput,
    handleInput,
    allowBackgroundAlerts,
    setAllowBackgroundAlerts,
    showCompleted,
    prevIndex,
    triggerChime,
    playStartAlert,
    alertMode,
  ]);
  
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}