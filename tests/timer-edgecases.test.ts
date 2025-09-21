import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as Timer from '@/utils/timer';

const setNow = (ms: number) => {
  vi.spyOn(Date, 'now').mockReturnValue(ms);
};

describe('utils/timer edge cases', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('pause/resume exactly at a phase boundary keeps correct index and remaining', () => {
    const phases: Timer.Phase[] = [
      { key: 'power' as any, seconds: 3 },
      { key: 'heart' as any, seconds: 3 },
      { key: 'wisdom' as any, seconds: 3 },
    ];
    let st = Timer.newState(phases);

    setNow(1_000);
    st = Timer.start(st);

    // Jump to exactly first boundary (t=4s)
    setNow(4_000);
    let now = Timer.computeNow(st);
    // At or after the boundary, index should be 1 and with ~3s remaining in phase 1
    expect(now.currentIndex).toBe(1);
    expect(Math.round(now.phaseRemainingMs / 1000)).toBe(3);

    // Pause exactly at boundary into phase 1
    st = Timer.pause(st);

    // Resume later; state should still be in phase 1 with ~3s remaining
    setNow(6_000);
    st = Timer.resume(st);
    now = Timer.computeNow(st);
    expect(now.currentIndex).toBe(1);
    expect(Math.round(now.phaseRemainingMs / 1000)).toBe(3);
  });

  it('handles long background gap that crosses multiple phases', () => {
    const phases: Timer.Phase[] = [
      { key: 'power' as any, seconds: 2 },
      { key: 'heart' as any, seconds: 2 },
      { key: 'wisdom' as any, seconds: 2 },
    ];
    let st = Timer.newState(phases);

    setNow(10_000);
    st = Timer.start(st);

    // 5s later -> should be into last phase
    setNow(15_000);
    const now = Timer.computeNow(st);
    expect(now.currentIndex).toBe(2);
    // total duration = 6s; 5s elapsed -> ~1s remaining
    expect(Math.round(now.phaseRemainingMs / 1000)).toBe(1);
  });

  it('createPhasesFromMinutes distributes remainder seconds fairly', () => {
    // 5 minutes => 300s => ideal 100/100/100
    let phases = Timer.createPhasesFromMinutes(5);
    expect(phases.map(p => p.seconds)).toEqual([100, 100, 100]);

    // 1 minute => 60s => 20/20/20
    phases = Timer.createPhasesFromMinutes(1);
    expect(phases.map(p => p.seconds)).toEqual([20, 20, 20]);

    // 2 minutes => 120s => 40/40/40
    phases = Timer.createPhasesFromMinutes(2);
    expect(phases.map(p => p.seconds)).toEqual([40, 40, 40]);

    // 7 minutes => 420s => 140/140/140
    phases = Timer.createPhasesFromMinutes(7);
    expect(phases.map(p => p.seconds)).toEqual([140, 140, 140]);
  });
});
