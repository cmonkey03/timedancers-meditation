import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as Timer from '@/utils/timer';

export type UsePhasedTimerState = {
  now: ReturnType<typeof Timer.computeNow>;
  running: boolean;
  started: boolean;
  phases: Timer.Phase[];
  startAtMs: number | null;
  pausedTotalMs: number;
};

export function usePhasedTimer(initialPhases: Timer.Phase[]) {
  const [timerState, setTimerState] = useState<Timer.TimerState>(() => Timer.newState(initialPhases));
  const [now, setNow] = useState(() => Timer.computeNow(timerState));

  const phases = timerState.phases;
  const running = timerState.running;
  const started = timerState.startAt != null;
  const startAtMs = timerState.startAt;
  const pausedTotalMs = timerState.pausedTotal;

  // Update phases when not started and not running
  const setPhases = useCallback((next: Timer.Phase[]) => {
    setTimerState((prev) => {
      if (prev.running || prev.startAt) return prev; // ignore while a session is in progress
      return Timer.newState(next);
    });
  }, []);

  // public controls
  const start = useCallback(() => setTimerState((s) => Timer.start(s)), []);
  const pause = useCallback(() => setTimerState((s) => Timer.pause(s)), []);
  const resume = useCallback(() => setTimerState((s) => Timer.resume(s)), []);
  const reset = useCallback(() => setTimerState((s) => Timer.reset(s)), []);

  // Only re-render when seconds or phase changes
  const lastPhaseIndexRef = useRef<number>(-1);
  const lastPhaseSecondsRef = useRef<number>(Number.NaN);
  const lastDoneRef = useRef<boolean>(false);

  useEffect(() => {
    const TICK_MS = 250;
    const tick = () => {
      setNow((prev) => {
        const computed = Timer.computeNow(timerState);
        const sec = Math.ceil(computed.phaseRemainingMs / 1000);
        const shouldUpdate =
          computed.currentIndex !== lastPhaseIndexRef.current ||
          sec !== lastPhaseSecondsRef.current ||
          computed.done !== lastDoneRef.current;
        if (shouldUpdate) {
          lastPhaseIndexRef.current = computed.currentIndex;
          lastPhaseSecondsRef.current = sec;
          lastDoneRef.current = computed.done;
          return computed;
        }
        return prev; // no change to derived values -> skip state update
      });
    };

    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [timerState]);

  // Keep 'now' in sync when timerState changes (immediate update)
  useEffect(() => {
    const computed = Timer.computeNow(timerState);
    lastPhaseIndexRef.current = computed.currentIndex;
    lastPhaseSecondsRef.current = Math.ceil(computed.phaseRemainingMs / 1000);
    lastDoneRef.current = computed.done;
    setNow(computed);
  }, [timerState]);

  const value: UsePhasedTimerState = useMemo(() => ({ now, running, started, phases, startAtMs, pausedTotalMs }), [now, running, started, phases, startAtMs, pausedTotalMs]);
  return { state: value, start, pause, resume, reset, setPhases };
}
