/**
 * Session effects hook for handling phase transitions and haptic feedback.
 *
 * Responsibilities:
 * - Trigger chimes on phase transitions
 * - Trigger haptic feedback on wheel changes
 * - Manage phase index tracking
 */
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';

export function useSessionEffects(
  timer: {
    running: boolean;
    now: {
      currentIndex: number;
      done: boolean;
      phaseRemainingMs: number;
    };
    started: boolean;
  },
  triggerChime: (event: any) => Promise<void>
) {
  const lastPhaseIndexRef = useRef<number>(-1);
  const prevIndexRef = useRef(timer.now.currentIndex);
  const [prevIndex, setPrevIndex] = useState(timer.now.currentIndex);

  // React to timer state updates to trigger chimes based on mode
  useEffect(() => {
    const now = timer.now;

    // Phase transition chimes - fire when entering a new phase
    if (timer.running && now.currentIndex !== lastPhaseIndexRef.current && !now.done) {
      const eventMap: Record<number, 'phase1to2' | 'phase2to3'> = {
        1: 'phase1to2',
        2: 'phase2to3',
      };
      const event = eventMap[now.currentIndex];
      if (event) {
        triggerChime(event);
      }
      lastPhaseIndexRef.current = now.currentIndex;
    }
  }, [timer, triggerChime]);

  // Haptic feedback on wheel change
  useEffect(() => {
    if (timer.now.currentIndex !== prevIndexRef.current && !timer.now.done) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      prevIndexRef.current = timer.now.currentIndex;
      setPrevIndex(timer.now.currentIndex);
    }
  }, [timer.now.currentIndex, timer.now.done]);

  // Reset phase index when timer resets
  useEffect(() => {
    if (!timer.started) {
      lastPhaseIndexRef.current = -1;
      prevIndexRef.current = 0;
      setPrevIndex(0);
    }
  }, [timer.started]);

  return prevIndex;
}
