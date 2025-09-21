import { useCallback, useEffect } from 'react';
import { getPhaseSeconds } from '@/utils/settings';
import * as Timer from '@/utils/timer';

export type Phase = Timer.Phase;

export function usePhaseConfig(
  minutesInput: string,
  timer: { running: boolean; started: boolean; phases: Phase[] },
  setPhases: (next: Phase[]) => void
) {
  const recomputeIdlePhases = useCallback(async (): Promise<boolean> => {
    if (timer.running || timer.started) return false;
    try {
      const ps = await getPhaseSeconds();
      let next: Phase[];
      const minutes = parseInt(minutesInput) || 3;
      const fromMinutes = Timer.createPhasesFromMinutes(minutes);
      if (ps.power || ps.heart || ps.wisdom) {
        // Use provided overrides; fill missing values from the current minutes-based equal split
        next = [
          { key: 'power', seconds: ps.power ?? fromMinutes[0].seconds },
          { key: 'heart', seconds: ps.heart ?? fromMinutes[1].seconds },
          { key: 'wisdom', seconds: ps.wisdom ?? fromMinutes[2].seconds },
        ];
      } else {
        next = fromMinutes;
      }
      const curr = timer.phases;
      const differs =
        curr[0]?.seconds !== next[0].seconds ||
        curr[1]?.seconds !== next[1].seconds ||
        curr[2]?.seconds !== next[2].seconds;
      if (differs) {
        if (__DEV__) console.log('[phase-config] applying phases', next.map(p => p.seconds));
        setPhases(next);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [minutesInput, timer.running, timer.started, timer.phases, setPhases]);

  useEffect(() => {
    // run on mount and when inputs change
    void recomputeIdlePhases();
  }, [recomputeIdlePhases]);

  const applyNow = useCallback(async (): Promise<boolean> => {
    // force recompute attempt (only applies if idle)
    return await recomputeIdlePhases();
  }, [recomputeIdlePhases]);

  return { applyNow };
}
