import { useCallback, useEffect, useMemo } from 'react';
import { getPhaseSeconds } from '@/utils/settings';
import * as Timer from '@/utils/timer';

export type Phase = Timer.Phase;

export function usePhaseConfig(
  minutesInput: string,
  timer: { running: boolean; started: boolean; phases: Phase[] },
  setPhases: (next: Phase[]) => void
) {
  const initialPhases = useMemo(() => Timer.createPhasesFromMinutes(3), []);

  const recomputeIdlePhases = useCallback(async () => {
    if (timer.running || timer.started) return;
    try {
      const ps = await getPhaseSeconds();
      let next: Phase[];
      if (ps.power || ps.heart || ps.wisdom) {
        next = [
          { key: 'power', seconds: ps.power ?? initialPhases[0].seconds },
          { key: 'heart', seconds: ps.heart ?? initialPhases[1].seconds },
          { key: 'wisdom', seconds: ps.wisdom ?? initialPhases[2].seconds },
        ];
      } else {
        const minutes = parseInt(minutesInput) || 3;
        next = Timer.createPhasesFromMinutes(minutes);
      }
      const curr = timer.phases;
      const differs =
        curr[0]?.seconds !== next[0].seconds ||
        curr[1]?.seconds !== next[1].seconds ||
        curr[2]?.seconds !== next[2].seconds;
      if (differs) setPhases(next);
    } catch {}
  }, [minutesInput, timer.running, timer.started, timer.phases, setPhases, initialPhases]);

  useEffect(() => {
    // run on mount and when inputs change
    recomputeIdlePhases();
  }, [recomputeIdlePhases]);

  const applyNow = useCallback(() => {
    // force recompute attempt (only applies if idle)
    recomputeIdlePhases();
  }, [recomputeIdlePhases]);

  return { applyNow };
}
